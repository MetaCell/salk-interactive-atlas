import os
import time
from enum import Enum

from django.urls import reverse

from cloudharness import log
from cloudharness.auth import AuthClient
from keycloak.exceptions import KeycloakGetError

KC_WORKSPACES_CLIENT_NAME = "workspaces"


# create the auth client
from cloudharness.utils.config import ALLVALUES_PATH
if os.path.isfile(ALLVALUES_PATH):
    # CH values exists so running with a valid config
    auth_client = AuthClient()
else:
    auth_client = None

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

