# init the auth service
from django.conf import settings
from cloudharness_django.services import init_services

init_services(
    client_name=settings.KC_CLIENT_NAME,
    client_roles=settings.KC_ALL_ROLES,
    default_user_role=settings.KC_USER_ROLE,
    privileged_roles=settings.KC_PRIVILEGED_ROLES,
    admin_role=settings.KC_ADMIN_ROLE,
)
