from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group

from admin_extra_buttons.api import ExtraButtonsMixin, button

from api.models import Experiment, Collaborator
from workspaces.services.user import user_service

# Register your models here.

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'last_modified')

class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ('user', 'experiment', 'role')

admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Collaborator, CollaboratorAdmin)


admin.site.unregister(User)
admin.site.unregister(Group)

class SalkUserAdmin(ExtraButtonsMixin, UserAdmin):
    @button()
    def sync_keycloak(self, request):
        user_service.sync_kc_users_groups()
        self.message_user(request, 'Keycloak users & groups synced.')


class SalkGroupAdmin(ExtraButtonsMixin, GroupAdmin):
    @button()
    def sync_keycloak(self, request):
        user_service.sync_kc_users_groups()
        self.message_user(request, 'Keycloak users & groups synced.')

admin.site.register(User, SalkUserAdmin)
admin.site.register(Group, SalkGroupAdmin)
