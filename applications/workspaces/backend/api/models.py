from django.db import models
from django.contrib.auth.models import Group, User

# Create your models here.

class Experiment(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField()
    is_private = models.BooleanField(default=True)
    date_created = models.DateField(auto_created=True)
    last_modified = models.DateField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    teams = models.ManyToManyField(Group)
    collaborators = models.ManyToManyField(User, related_name="collaborators", through="Collaborator")

    def __str__(self):
        return self.name


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value==value).label   
    VIEWER = 'v', 'Viewer'
    EDITOR = 'e', 'Editor'

class Collaborator(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    role = models.CharField(max_length=1, choices=CollaboratorRole.choices, default=CollaboratorRole.VIEWER)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.experiment} ({CollaboratorRole.to_str(self.role)})"
