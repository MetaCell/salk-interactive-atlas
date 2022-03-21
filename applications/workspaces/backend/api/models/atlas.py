from django.db import models


# Create your models here.
class AtlasesChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    SLK10 = "slk10", "Salk cord 10um"
    ALN20 = "aln20", "Allen cord 20um"
