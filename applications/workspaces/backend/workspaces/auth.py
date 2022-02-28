import time
from enum import Enum

from django.urls import reverse
from django.contrib.auth.models import User

from mozilla_django_oidc.auth import OIDCAuthenticationBackend

from cloudharness import log
from cloudharness.auth import AuthClient
from keycloak.exceptions import KeycloakGetError

KC_WORKSPACES_CLIENT_NAME = "workspaces"

class ClientRoles(Enum):
    KC_WORKSPACES_ADMIN_ROLE = f"{KC_WORKSPACES_CLIENT_NAME}-administrator"  # admin user
    KC_WORKSPACES_USER_ROLE = f"{KC_WORKSPACES_CLIENT_NAME}-user"  # customer user


PRIVILEGED_ROLES = [
    ClientRoles.KC_WORKSPACES_ADMIN_ROLE,
]
CUSTOMER_ROLE = ClientRoles.KC_WORKSPACES_USER_ROLE


class AuthorizationLevel(Enum):
    NO_AUTHORIZATION = 1
    CUSTOMER = 2
    PRIVILEGED = 3


def get_client_name():
    return KC_WORKSPACES_CLIENT_NAME


def create_client():
    """
    Setup Keycloak for Salk

    Checks if the salk client is present, if not the creates it
    """
    nap_time = 30
    installed = False
    while not installed:
        try:
            auth_client = AuthClient()
            try:
                client = auth_client.get_client(KC_WORKSPACES_CLIENT_NAME)
            except KeycloakGetError as e:
                # thrown if client doesn't exist
                auth_client.create_client(client_name=KC_WORKSPACES_CLIENT_NAME)
                client = auth_client.get_client(KC_WORKSPACES_CLIENT_NAME)

            for role in ClientRoles:
                try:
                    auth_client.create_client_role(client["id"], role.value)
                except KeycloakGetError as e:
                    # Thrown if role already exists
                    log.debug(e.error_message)

            installed = True
        except Exception as e:
            log.error(e)
            time.sleep(nap_time)


def get_auth_level():
    roles = auth_client.get_current_user_client_roles(KC_WORKSPACES_CLIENT_NAME)
    assigned_roles = [r["name"] for r in roles]

    privileged = any([role in assigned_roles for role in PRIVILEGED_ROLES])
    if privileged:
        return AuthorizationLevel.PRIVILEGED

    customer = CUSTOMER_ROLE in assigned_roles
    if customer:
        return AuthorizationLevel.CUSTOMER

    return AuthorizationLevel.NO_AUTHORIZATION


from rest_framework import authentication
class BearerAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        if request.get_full_path() == reverse('openapi-schema'):
            return (User(), None)

        ac = AuthClient()
        kc_user = ac.get_current_user()
        if not kc_user:
         return None

        user, created = User.objects.get_or_create(email=kc_user["email"])
        if created:
            user.username = kc_user["email"]
        user.first_name = kc_user["firstName"]
        user.last_name = kc_user["lastName"]
        if ac.user_has_client_role(kc_user["id"], get_client_name(), ClientRoles.KC_WORKSPACES_ADMIN_ROLE.value):
            # make user a Django superuser
            user.is_staff = True
            user.is_superuser = True
        user.save()

        return (user, None)


class WorkspacesOIDCAB(OIDCAuthenticationBackend):

    def __init__(self, *args, **argv):
        super(WorkspacesOIDCAB, self).__init__(args, argv)
        self.ac = AuthClient()

    def get_kc_user(self, user):
        all_users = self.ac.get_users()
        return [kc_user for kc_user in all_users if kc_user["email"] == user.email][0]

    def map_kc_user(self, user, kc_user=None, is_superuser=None):
        if not kc_user:
            kc_user = self.get_kc_user(user)

        if is_superuser is None:
            is_superuser = self.ac.user_has_client_role(kc_user["id"], get_client_name(), ClientRoles.KC_WORKSPACES_ADMIN_ROLE.value)
        if is_superuser:
            # make user a Django superuser
            user.is_staff = True
            user.is_superuser = True
        else:
            user.is_staff = False
            user.is_superuser = False

        user.username = kc_user.get("username", kc_user["email"])
        user.first_name = kc_user.get("firstName", "")
        user.last_name = kc_user.get("lastName", "")
        return user

    def create_user(self, claims):
        user = super(WorkspacesOIDCAB, self).create_user(claims)
        user = self.map_kc_user(user)
        user.save()

        return user

    def update_user(self, user, claims):
        user = self.map_kc_user(user)
        user.save()

        return user

    def sync_all_kc_users(self):
        all_users = self.ac.get_users()
        all_admin_users = self.ac.get_client_role_members(get_client_name(), ClientRoles.KC_WORKSPACES_ADMIN_ROLE.value)
        for kc_user in all_users:
            email = kc_user["email"]
            is_superuser = len([admin_user for admin_user in all_admin_users if admin_user["email"] == email]) > 0
            user, created = User.objects.get_or_create(email=email)
            user = self.map_kc_user(user, kc_user, is_superuser)
            user.save()

