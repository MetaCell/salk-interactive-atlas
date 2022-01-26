from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework import authentication
from rest_framework import exceptions

from ch.auth import AuthClient

ac = AuthClient()

class BearerAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        if request.get_full_path() == reverse('openapi-schema'):
            return (User(), None)

        ac.set_token(request.META.get("HTTP_AUTHORIZATION"))
        kcuser = ac.get_current_user()
        if not kcuser:
         return None

        user = User()
        user.id = kcuser.id
        user.username = kcuser.username
        user.first_name = kcuser.firstName
        user.last_name = kcuser.lastName
        user.email = kcuser.email
        return (user, None)
