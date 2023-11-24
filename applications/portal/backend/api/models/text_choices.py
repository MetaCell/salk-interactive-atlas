from django.db import models


class AtlasesChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    SLK10 = "salk_cord_10um", "Salk cord 10um"
    # ALN20 = "allen_cord_20um", "Allen cord 20um"  # for now we disable this atlas


class PopulationStatus(models.TextChoices):
    ERROR = "error"
    PENDING = "pending"
    RUNNING = "running"
    FINISHED = "finished"


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value == value).label

    VIEWER = "v", "Viewer"
    EDITOR = "e", "Editor"


class NotificationMethodsChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(
            v for v in list(NotificationMethodsChoice) if v.value == value
        ).label

    EMAIL = "email", "Email"

