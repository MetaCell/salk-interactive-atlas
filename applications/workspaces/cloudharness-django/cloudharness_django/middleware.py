from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User

from rest_framework import authentication

from keycloak.exceptions import KeycloakGetError

from cloudharness.auth.keycloak import AuthClient
from cloudharness.middleware import get_authentication_token
from cloudharness_django.services import get_user_service


class AutomaticLoginUserMiddleware:
    def __init__(self, get_response):
        # One-time configuration and initialization.
        self.get_response = get_response
        try:
            self.ac = AuthClient()
        except:
            self.ac = None

    def __call__(self, request):
        if getattr(getattr(request, "user", {}), "is_anonymous", True) and \
           self.ac and \
           get_authentication_token():
            # no django user --> get the current user from the jwt token and keycloak
            try:
                kc_user = self.ac.get_current_user()
                try:
                    user = User.objects.get(member__kc_id=kc_user["id"])
                except User.DoesNotExist:
                    user = get_user_service().sync_kc_user(kc_user)
                if user:
                    # auto login, set the user
                    request.user = user
            except KeycloakGetError:
                # KC user not found
                pass

        if hasattr(request, "user"):
            if not request.user.is_anonymous and not request.user.is_authenticated:
                # auto login for non anonymous users
                login(request, request.user)

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

class AutomaticLoginUserMiddlewareOIDC(authentication.BaseAuthentication):
    def authenticate(self, request):

        user = getattr(request._request, 'user', None)
        if user:
            return user, None
        if get_authentication_token():
            try:
                kc_user = self.ac.get_current_user()
                user = User.objects.get(member__kc_id=kc_user["id"])
                if user:
                    # auto login
                    request.user = user
                    login(request, request.user)
                    return user
            except KeycloakGetError:
                # KC user not found
                pass

        return None
