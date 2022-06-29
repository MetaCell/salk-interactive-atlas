from django.db import models


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value == value).label

    VIEWER = "v", "Viewer"
    EDITOR = "e", "Editor"
