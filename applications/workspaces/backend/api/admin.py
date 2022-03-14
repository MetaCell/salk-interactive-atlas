from django.contrib import admin

from api.models import Experiment, Collaborator, Population, Tag


# Register your models here.

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'last_modified')
    search_fields = ('name', 'owner__email')
    autocomplete_fields = ('owner',)
    filter_horizontal = ('teams',)


class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ('user', 'experiment', 'role')
    autocomplete_fields = ('user',)
    raw_id_fields = ('experiment',)


class PopulationAdmin(admin.ModelAdmin):
    pass


class TagAdmin(admin.ModelAdmin):
    pass


admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Collaborator, CollaboratorAdmin)
admin.site.register(Population, PopulationAdmin)
admin.site.register(Tag, TagAdmin)
