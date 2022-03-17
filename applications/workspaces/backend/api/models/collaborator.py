from django.db import models
from django.contrib.auth.models import User

from .experiment import Experiment


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value == value).label

    VIEWER = "v", "Viewer"
    EDITOR = "e", "Editor"


class Collaborator(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    role = models.CharField(
        max_length=1, choices=CollaboratorRole.choices, default=CollaboratorRole.VIEWER
    )
    shared_on = models.DateTimeField(auto_now_add=True)

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
            or self.user == request.user
        )

    def has_object_write_permission(self, request):
        return (
            self.experiment.has_object_write_permission(request)
            or self.user == request.user
        )

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.experiment} ({CollaboratorRole.to_str(self.role)})"

    class Meta:
        unique_together = [["user", "experiment"]]
