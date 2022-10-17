import logging
import os

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from PIL import Image

from ..constants import (
    POPULATIONS_DATA,
    POPULATIONS_SPLIT_DATA,
    PopulationPersistentFiles,
)
from ..helpers.generate_population_cells import get_cells_filepath
from ..services.filesystem_service import create_dir, remove_dir, remove_file
from ..services.population_service import generate_images, split_cells_per_segment
from ..utils import has_property, is_valid_hex_str
from .atlas import AtlasesChoice
from .experiment import Experiment


class PopulationObjectsManager(models.Manager):
    def get_queryset(self):
        return (
            super(PopulationObjectsManager, self)
            .get_queryset()
            .select_related(
                "experiment",
            )
        )


class PopulationStatus(models.TextChoices):
    ERROR = "error"
    PENDING = "pending"
    RUNNING = "running"
    FINISHED = "finished"


class Population(models.Model):
    DEFAULT_COLOR = "#000000"
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    atlas = models.CharField(
        max_length=100, choices=AtlasesChoice.choices, default=AtlasesChoice.SLK10
    )
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # hex color
    opacity = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)], default=1.0
    )
    cells = models.FileField(upload_to=POPULATIONS_DATA)
    status = models.CharField(
        choices=PopulationStatus.choices,
        editable=False,
        default=PopulationStatus.PENDING,
        max_length=8,
    )

    # objects = models.Manager()
    objects = PopulationObjectsManager()

    @property
    def storage_path(self) -> str:
        return os.path.join(settings.PERSISTENT_ROOT, POPULATIONS_DATA)

    @property
    def split_storage_path(self) -> str:
        return os.path.join(self.storage_path, str(self.id), POPULATIONS_SPLIT_DATA)

    def get_subdivision_storage_path(
        self, subdivision, content: PopulationPersistentFiles
    ) -> str:
        return os.path.join(self.split_storage_path, subdivision + content.value)

    def remove_split_cells_csv(self):
        remove_dir(self.split_storage_path)

    def create_split_storage(self):
        create_dir(self.split_storage_path)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        self.update_color()
        has_file_changed = self._has_file_changed()
        super(Population, self).save(force_insert, force_update, using, update_fields)
        if has_file_changed:  # Only trigger workflow on cells changes
            from ..services.workflows_service import (
                execute_generate_population_static_files_workflow,
            )
            execute_generate_population_static_files_workflow(self.id)

    def delete(self, using=None, keep_parents=False):
        remove_file(self.cells.path)
        super(Population, self).delete(using, keep_parents)

    def _has_file_changed(self):
        try:
            current = Population.objects.get(id=self.id)
        except Population.DoesNotExist:
            return has_property(self.cells, "file")
        return (
            not has_property(current.cells, "file") and has_property(self.cells, "file")
        ) or (
            has_property(self.cells, "file")
            and self.cells.file.name != current.cells.file.name
        )

    def generate_cells(self, data_filepath: str):
        self.status = PopulationStatus.RUNNING
        self.save()
        try:
            self.cells.name = get_cells_filepath(self.name, data_filepath, self.storage_path)
        except Exception as e:
            logging.exception(e)
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
        logging.exception(e)
        self.status = PopulationStatus.ERROR
        self.save()
        raise e

    def get_image_path(self, subdivision: str, content: PopulationPersistentFiles) -> str:
        return self.get_subdivision_storage_path(subdivision, content)

    def get_image(self, subdivision: str, content: PopulationPersistentFiles) -> Image:
        return Image.open(self.get_image_path(subdivision, content))
    
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
