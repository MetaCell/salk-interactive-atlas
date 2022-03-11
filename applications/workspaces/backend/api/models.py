from enum import Enum

from django.db import models
from django.contrib.auth.models import Group, User


# Create your models here.

class AtlasesChoice(Enum):
    SLK10 = "salk_cord_10um"
    ALN20 = "allen_cord_20um"


class Atlas(models.Model):
    language = models.CharField(
        max_length=100,
        choices=[(tag, tag.value) for tag in AtlasesChoice],
        default=(AtlasesChoice.SLK10, AtlasesChoice.SLK10.value)
    )


class Experiment(models.Model):
    name = models.CharField(max_length=100)
    is_private = models.BooleanField(default=True)
    description = models.TextField()
    date_created = models.DateField(auto_created=True)
    last_modified = models.DateField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    teams = models.ManyToManyField(Group, blank=True)
    collaborators = models.ManyToManyField(User, related_name="collaborators", through="Collaborator")
    atlases = models.ManyToManyField(Atlas, through='Population')

    def __str__(self):
        return self.name


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value == value).label

    VIEWER = 'v', 'Viewer'
    EDITOR = 'e', 'Editor'


class Collaborator(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    role = models.CharField(max_length=1, choices=CollaboratorRole.choices, default=CollaboratorRole.VIEWER)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.experiment} ({CollaboratorRole.to_str(self.role)})"


class Population(models.Model):
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    atlas = models.ForeignKey(Atlas, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)  # hex color


class Cell(models.Model):
    x = models.DecimalField()
    y = models.DecimalField()
    z = models.DecimalField()
    population = models.ForeignKey(Population, on_delete=models.CASCADE)
