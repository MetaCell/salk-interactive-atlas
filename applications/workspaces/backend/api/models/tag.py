from django.db import models


# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_list_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        return True

    def __str__(self):
        return f"{self.name}"
