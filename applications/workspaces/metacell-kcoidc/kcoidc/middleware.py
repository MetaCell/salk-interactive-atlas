from django.contrib.auth import login
from django.contrib.auth.models import User

from keycloak.exceptions import KeycloakGetError

from cloudharness.auth.keycloak import AuthClient
from cloudharness.middleware import get_authentication_token


class AutomaticLoginUserMiddleware:
    def __init__(self, get_response):
        # One-time configuration and initialization.
        self.get_response = get_response
        self.ac = AuthClient()

    def __call__(self, request):
        if get_authentication_token():
            try:
                kc_user = self.ac.get_current_user()
                user = User.objects.get(member__kc_id=kc_user["id"])
                if user:
                    # auto login
                    request.user = user
                    login(request, user)
            except KeycloakGetError:
                # KC user not found
                pass

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
