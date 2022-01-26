from django.contrib import admin

from experiment.models import Experiment

# Register your models here.

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'last_modified')

admin.site.register(Experiment, ExperimentAdmin)
