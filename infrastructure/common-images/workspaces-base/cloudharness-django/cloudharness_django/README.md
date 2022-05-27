=============
KeyCloak OIDC
=============

Quick start
-----------

1. Add "cloudharness_django" to your INSTALLED_APPS setting like this:
    ```
    INSTALLED_APPS = [
        ...
        'cloudharness_django',
    ]
    ```

2. Initialize the CloudHarness Django services
    in your settings.py add
    ```
    # Appplication name
    KC_CLIENT_NAME = "DEMO_APP"

    # Application roles
    KC_ADMIN_ROLE = f"{KC_CLIENT_NAME}-administrator"  # admin user
    KC_MANAGER_ROLE = f"{KC_CLIENT_NAME}-manager"  # manager user
    KC_USER_ROLE = f"{KC_CLIENT_NAME}-user"  # normal user

    KC_ALL_ROLES = [
        KC_ADMIN_ROLE,
        KC_MANAGER_ROLE,
        KC_USER_ROLE,
    ]

    KC_PRIVILEGED_ROLES = [
        KC_MANAGER_ROLE,
    ]

    KC_DEFAULT_USER_ROLE = KC_USER_ROLE  # set to None for no default user role
    ```

    then at application startup execute these commands:
    ```
    # init the auth service
    from django.conf import settings
    from cloudharness_django.services import init_services

    init_services(
        client_name=settings.KC_CLIENT_NAME,
        client_roles=settings.KC_ALL_ROLES,
        default_user_role=settings.KC_DEFAULT_USER_ROLE,
        privileged_roles=settings.KC_PRIVILEGED_ROLES,
        admin_role=settings.KC_ADMIN_ROLE,
    )
    ```

4. Start the development server and visit http://127.0.0.1:8000/

5. Use the services for accessing Keycloak
    ```
    from cloudharness_django.services import get_auth_service
    auth_service = get_auth_service()
    auth_client = auth_service.get_auth_client()
    kc_user = auth_client.get_current_user()
    auth_level = auth_service.get_auth_level(kc_user)
    ```
