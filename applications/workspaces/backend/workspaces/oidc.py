from rest_framework import authentication
from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from workspaces.services.user import get_user_service

class WorkspacesOIDCAB(OIDCAuthenticationBackend):

    def __init__(self, *args, **argv):
        super(WorkspacesOIDCAB, self).__init__(args, argv)

    def create_user(self, claims):
        user = super(WorkspacesOIDCAB, self).create_user(claims)
        user = get_user_service().map_kc_user(user)
        user.save()
        return user

    def update_user(self, user, claims):
        user = get_user_service().map_kc_user(user)
        user.save()
        return user
