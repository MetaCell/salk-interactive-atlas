from django.db import models


class Cell(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

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
        return f"{self.x, self.y, self.z}"
