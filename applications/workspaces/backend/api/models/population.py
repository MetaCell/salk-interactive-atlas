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


class Cell(models.Model):
    x = models.DecimalField(decimal_places=2, max_digits=6)
    y = models.DecimalField(decimal_places=2, max_digits=6)
    z = models.DecimalField(decimal_places=2, max_digits=6)
    population = models.ForeignKey(Population, on_delete=models.CASCADE)
