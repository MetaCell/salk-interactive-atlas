from django.db import models


# Create your models here.
class AtlasesChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    SLK10 = "salk_cord_10um", "Salk cord 10um"
    ALN20 = "allen_cord_20um", "Allen cord 20um"
