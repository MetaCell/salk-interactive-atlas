from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from admin_extra_buttons.api import ExtraButtonsMixin, button

from api.models import Experiment
from workspaces.auth import WorkspacesOIDCAB

# Register your models here.

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_private', 'last_modified')

admin.site.register(Experiment, ExperimentAdmin)


admin.site.unregister(User)
class MyUserAdmin(ExtraButtonsMixin, UserAdmin):
    @button()
    def sync_keycloak(self, request):
        WorkspacesOIDCAB().sync_all_kc_users()
        self.message_user(request, 'Keycloak users synced.')

admin.site.register(User, MyUserAdmin)
