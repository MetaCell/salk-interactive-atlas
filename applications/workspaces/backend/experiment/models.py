from django.db import models

# Create your models here.
class Experiment(models.Model):
    name = models.CharField(max_length = 100)
    description = models.TextField()
    is_private = models.BooleanField(default=True)
    owner_user_id = models.CharField(max_length = 40)
    date_created = models.DateField(auto_created=True)
    last_modified = models.DateField(auto_now=True)

    def __str___(self):
        return self.name
