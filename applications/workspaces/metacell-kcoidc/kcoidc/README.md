=============
KeyCloak OIDC
=============

Quick start
-----------

1. Add "kcoidc" to your INSTALLED_APPS setting like this:
    ```
    INSTALLED_APPS = [
        ...
        'kcoidc',
    ]
    ```

2. Initialize the KC OIDC services
    ```
    from enum import Enum

    # init the auth service

    # Appplication name
    KC_CLIENT_NAME = "DEMO_APP"

    # Application roles
    class ClientRoles(Enum):
        KC_WORKSPACES_ADMIN_ROLE = f"{KC_CLIENT_NAME}-administrator"  # admin user
        KC_WORKSPACES_MANAGER_ROLE = f"{KC_CLIENT_NAME}-manager"  # manager user
        KC_WORKSPACES_USER_ROLE = f"{KC_CLIENT_NAME}-user"  # normal user

    # Priviliged user roles
    PRIVILEGED_ROLES = [
        ClientRoles.KC_WORKSPACES_MANAGER_ROLE,
    ]

    # Admin user role
    ADMIN_ROLE = ClientRoles.KC_WORKSPACES_ADMIN_ROLE

    from kcoidc.services import init_services
    init_services(
        KC_CLIENT_NAME,
        ClientRoles,
        PRIVILEGED_ROLES,
        ADMIN_ROLE
    )
    ```

4. Start the development server and visit http://127.0.0.1:8000/

5. Use the services for accessing Keycloak
    ```
    from kcoidc.services import get_auth_service
    auth_service = get_auth_service()
    auth_client = auth_service.get_auth_client()
    kc_user = auth_client.get_current_user()
    auth_level = auth_service.get_auth_level(kc_user)
    ```
