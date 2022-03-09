from enum import Enum

# init the auth service
KC_CLIENT_NAME = "workspaces"
class ClientRoles(Enum):
    KC_WORKSPACES_ADMIN_ROLE = f"{KC_CLIENT_NAME}-administrator"  # admin user
    KC_WORKSPACES_MANAGER_ROLE = f"{KC_CLIENT_NAME}-manager"  # manager user
    KC_WORKSPACES_USER_ROLE = f"{KC_CLIENT_NAME}-user"  # normal user

PRIVILEGED_ROLES = [
    ClientRoles.KC_WORKSPACES_MANAGER_ROLE,
]
ADMIN_ROLE = ClientRoles.KC_WORKSPACES_ADMIN_ROLE
DEFAULT_USER_ROLE = ClientRoles.KC_WORKSPACES_USER_ROLE

from kcoidc.services import init_services
init_services(
    KC_CLIENT_NAME,
    ClientRoles,
    DEFAULT_USER_ROLE,
    PRIVILEGED_ROLES,
    ADMIN_ROLE
)
