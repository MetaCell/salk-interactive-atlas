from django.contrib import admin

from api.models import Cell, Collaborator, Experiment, Population, Tag, UserDetail

# Register your models here.

class CellInline(admin.TabularInline):
    model = Cell
    extra = 10

class PopulationInline(admin.TabularInline):
    model = Population
    show_change_link = True
    extra = 1

class UserDetailAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user__name",)


class ExperimentAdmin(admin.ModelAdmin):
    list_display = ("name", "is_private", "last_modified")
    search_fields = ("name", "owner__email")
    autocomplete_fields = ("owner",)
<<<<<<< HEAD
    filter_horizontal = (
        "teams",
        "tags",
    )
    inlines = [PopulationInline,]
=======
    filter_horizontal = ("teams", "tags", )
>>>>>>> develop


class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ("user", "experiment", "role")
    search_fields = ("experiment__name", "user__email")
    autocomplete_fields = ("user",)
    raw_id_fields = ("experiment",)


<<<<<<< HEAD
class PopulationAdmin(admin.ModelAdmin):
    list_display = ("experiment", "atlas", "name", "color")
    inlines = [CellInline,]
=======

class PopulationAdmin(admin.ModelAdmin):
    list_display = ('experiment', 'atlas', 'name', 'color')
>>>>>>> develop


class TagAdmin(admin.ModelAdmin):
    pass

<<<<<<< HEAD


=======
class CellAdmin(admin.ModelAdmin):
    pass

admin.site.register(Cell, CellAdmin)
>>>>>>> develop
admin.site.register(UserDetail, UserDetailAdmin)
admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Collaborator, CollaboratorAdmin)
admin.site.register(Population, PopulationAdmin)
admin.site.register(Tag, TagAdmin)
