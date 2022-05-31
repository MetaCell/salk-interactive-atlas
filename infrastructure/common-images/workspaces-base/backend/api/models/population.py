import os

from PIL import Image
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .atlas import AtlasesChoice
from .experiment import Experiment
from ..constants import PopulationPersistentFiles
from ..helpers.filesystem import create_dir, remove_dir
from ..helpers.generate_population_cells import get_cells_file
from ..services.population_service import generate_images, split_cells_per_segment
from ..services.workflows_service import execute_generate_population_static_files_workflow
from ..utils import is_valid_hex_str


class PopulationStatus(models.TextChoices):
    ERROR = "error"
    PENDING = "pending"
    RUNNING = "running"
    FINISHED = "finished"


class Population(models.Model):
    DEFAULT_COLOR = "#000000"
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    atlas = models.CharField(
        max_length=100, choices=AtlasesChoice.choices, default=AtlasesChoice.SLK10
    )
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7)  # hex color
    opacity = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], default=1.0
    )
    cells = models.FileField(upload_to="populations")
    status = models.CharField(
        choices=PopulationStatus.choices, editable=False, default=PopulationStatus.PENDING, max_length=8
    )

    @property
    def save_dir_path(self):
        return os.path.join(settings.PERSISTENT_ROOT, "populations", str(self.id))

    def get_subdivision_path(self, subdivision, content: PopulationPersistentFiles):
        return os.path.join(self.save_dir_path, subdivision + content.value)

    def remove_split_cells_csv(self):
        remove_dir(self.save_dir_path)

    def create_dir(self):
        create_dir(self.save_dir_path)

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.update_color()
        has_file_changed = self._has_file_changed()
        super(Population, self).save(force_insert, force_update, using, update_fields)
        if has_file_changed:  # Only trigger workflow on cells changes
            execute_generate_population_static_files_workflow(self.id)

    def _has_file_changed(self):
        try:
            current = Population.objects.get(id=self.id)
        except Population.DoesNotExist:
            return True
        return (not hasattr(current.cells, 'files') and hasattr(self.cells, 'files')) \
               or (hasattr(self.cells, 'files') and self.cells.file.name != current.cells.file.name)

    def generate_cells(self, key_filename: str):
        try:
            self.cells = get_cells_file(key_filename)
        except Exception:
            self.status = PopulationStatus.ERROR
        self.save()

    def generate_static_files(self):
        self.status = PopulationStatus.RUNNING
        self.save()
        try:
            self.remove_split_cells_csv()
            split_cells_per_segment(self)
        except Exception as e:
            self._process_error(e)
        try:
            generate_images(self)
        except Exception as e:
            self._process_error(e)
        self.status = PopulationStatus.FINISHED
        self.save()

    def _process_error(self, e):
        self.status = PopulationStatus.ERROR
        self.save()
        raise e

    def get_image(self, subdivision: str, content: PopulationPersistentFiles) -> Image:
        return Image.open(self.get_subdivision_path(subdivision, content))

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_list_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        experiment_id = request.data.get("experiment")
        try:
            experiment = Experiment.objects.get(id=experiment_id)
            return experiment.has_object_write_permission(request)
        except Experiment.DoesNotExist:
            return True

    def has_object_read_permission(self, request):
        return self.experiment.has_object_read_permission(request)

    def has_object_write_permission(self, request):
        return self.experiment.has_object_write_permission(request)

    def update_color(self):
        if not is_valid_hex_str(self.color):
            self.color = Population.DEFAULT_COLOR

    def __str__(self):
        return f"{self.experiment} {self.name}"

    class Meta:
        unique_together = [["experiment", "name"]]
