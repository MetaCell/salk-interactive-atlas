from django.db import models

from .atlas import AtlasesChoice
from .experiment import Experiment


class Population(models.Model):
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    atlas = models.CharField(
        max_length=5, choices=AtlasesChoice.choices, default=AtlasesChoice.SLK10
    )
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7)  # hex color

    cells = models.FileField(upload_to='populations')

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
        return (
            self.experiment.has_object_read_permission(request)
        )

    def has_object_write_permission(self, request):
        return (
            self.experiment.has_object_write_permission(request)
        )

    def __str__(self):
        return f"{self.experiment} {self.name}"

    class Meta:
        unique_together = [["experiment", "name"]]
