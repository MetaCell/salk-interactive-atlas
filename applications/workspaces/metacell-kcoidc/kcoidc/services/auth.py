import os
import time
from enum import Enum

from django.urls import reverse

from keycloak.exceptions import KeycloakGetError

from cloudharness import log
from cloudharness.auth import AuthClient
from cloudharness.utils.config import ALLVALUES_PATH

from kcoidc.exceptions import KeycloakOIDCNoAdminRole, KeycloakOIDCAuthServiceNotInitError


class AuthorizationLevel(Enum):
    NO_AUTHORIZATION = 1
    NON_PRIVILEGED = 2
    PRIVILEGED = 3
    ADMIN = 4


# create the auth client
if os.path.isfile(ALLVALUES_PATH):
    # CH values exists so running with a valid config
    auth_client = AuthClient()
else:
    auth_client = None


class AuthService:

    def __init__(
            self,
            client_name: str,
            client_roles: [str],
            privileged_roles: [str],
            admin_role: str
        ):
        self.client_name = client_name
        self.client_roles = client_roles
        self.privileged_roles = privileged_roles
        if not admin_role:
            raise KeycloakOIDCNoAdminRole()
        else:
            self.admin_role = admin_role

    @classmethod
    def get_auth_client(cls):
        return auth_client

    def get_client_name(self):
        return self.client_name

    def get_admin_role(self):
        return self.admin_role

    def create_client(self):
        """
        Create the client and client roles
        Checks if the client is present, if not the creates it
        """
        nap_time = 30
        installed = False
        while not installed:
            try:
                try:
                    client = auth_client.get_client(self.get_client_name())
                except KeycloakGetError as e:
                    # thrown if client doesn't exist
                    auth_client.create_client(client_name=self.get_client_name())
                    client = auth_client.get_client(self.get_client_name())

                for role in self.client_roles:
                    try:
                        auth_client.create_client_role(client["id"], role.value)
                    except KeycloakGetError as e:
                        # Thrown if role already exists
                        log.debug(e.error_message)

                installed = True
            except Exception as e:
                log.error(e)
                time.sleep(nap_time)

    def get_auth_level(self, kc_user=None, kc_roles=None):
        if not kc_user:
            kc_user = auth_client.get_current_user()
        
        if not kc_roles:
            kc_roles = auth_client.get_user_client_roles(
                kc_user.get("id"),
                self.get_client_name()
            )
        assigned_roles = [r["name"] for r in kc_roles]

        admin = self.admin_role.value in assigned_roles
        if admin:
            return AuthorizationLevel.ADMIN

        privileged = any([role in assigned_roles for role in self.privileged_roles])
        if privileged:
            return AuthorizationLevel.PRIVILEGED

        non_privileged = any([role in assigned_roles for role in self.client_roles])
        if non_privileged:
            return AuthorizationLevel.NON_PRIVILEGED

        return AuthorizationLevel.NO_AUTHORIZATION
