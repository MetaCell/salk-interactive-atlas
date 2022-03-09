from django.contrib import admin

from api.models import Experiment, Collaborator

# Register your models here.

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'last_modified')

class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ('user', 'experiment', 'role')

admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Collaborator, CollaboratorAdmin)
