from rest_framework import authentication
from mozilla_django_oidc.auth import OIDCAuthenticationBackend


class KCOIDCAB(OIDCAuthenticationBackend):

    def __init__(self, *args, **argv):
        super(KCOIDCAB, self).__init__(args, argv)
        from kcoidc.services import get_user_service
        self.user_service = get_user_service()

    def create_user(self, claims):
        user = super(KCOIDCAB, self).create_user(claims)
        user = self.user_service.map_kc_user(user)
        user.save()
        return user

    def update_user(self, user, claims):
        user = self.user_service.map_kc_user(user)
        user.save()
        return user
