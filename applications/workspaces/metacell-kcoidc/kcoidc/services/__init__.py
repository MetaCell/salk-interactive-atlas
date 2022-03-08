from kcoidc.exceptions import \
    KeycloakOIDCAuthServiceNotInitError, \
    KeycloakOIDUserServiceNotInitError, \
    KeycloakOIDUserServiceNotInitError

_auth_service = None
_user_service = None

def get_auth_service():
    global _auth_service
    if not _auth_service:
        raise KeycloakOIDCAuthServiceNotInitError("Auth Service not initialized")
    return _auth_service

def get_user_service():
    global _user_service
    if not _user_service:
        raise KeycloakOIDUserServiceNotInitError("User Service not initialized")
    return _user_service

def init_services(
        client_name: str,
        client_roles: [str],
        privileged_roles: [str],
        admin_role: str):
    from kcoidc.services.auth import AuthService
    from kcoidc.services.user import UserService
    global _auth_service, _user_service
    _auth_service = AuthService(client_name, client_roles, privileged_roles, admin_role)
    _user_service = UserService(_auth_service)
    return _auth_service
