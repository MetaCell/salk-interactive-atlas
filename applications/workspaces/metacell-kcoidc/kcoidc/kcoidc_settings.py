import os
from django.conf import settings


# ***********************************************************************
# * KC OIDC settings
# ***********************************************************************
from cloudharness.applications import get_configuration, get_current_configuration
from cloudharness.utils.config import CloudharnessConfig, ALLVALUES_PATH

# add the 3rd party apps
INSTALLED_APPS = getattr(
    settings,
    'INSTALLED_APPS',
    []) + [ 'rest_framework',
            'mozilla_django_oidc',
            'admin_extra_buttons',]

# add the local apps
INSTALLED_APPS += ['kcoidc',]

# add the CH authentication middleware
MIDDLEWARE = getattr(
    settings,
    'MIDDLEWARE',
    []) + ['cloudharness.middleware.django.CloudharnessMiddleware',]

# Keycloak Rest Framework
REST_FRAMEWORK = getattr(
    settings,
    'REST_FRAMEWORK',
    {
    'DEFAULT_AUTHENTICATION_CLASSES' : [
        'mozilla_django_oidc.contrib.drf.OIDCAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
})

AUTHENTICATION_BACKENDS = getattr(
    settings,
    'AUTHENTICATION_BACKENDS',
    []) + ['kcoidc.oidc.KCOIDCAB',]

# test if the kubernetes CH all values exists, if so then set up the OIDC config
# IMPROTANT NOTE:
#   when testing/debugging copy the deployment/helm/values.yaml to the ALLVALUES_PATH
if os.path.isfile(ALLVALUES_PATH):
    # try to setup the env needed to run

    # get the application CH configs
    accounts_app = get_configuration('accounts')
    current_app = get_current_configuration()

    client_id = accounts_app.conf.webclient.id # Client ID configured in the Auth Server
    client_secret = accounts_app.conf.webclient.secret
    realm = CloudharnessConfig.get_namespace()
    accounts_public_url = accounts_app.get_public_address()

    # Setup OIDC
    KEYCLOAK_EXEMPT_URIS = []
    KEYCLOAK_CONFIG = {
        'KEYCLOAK_SERVER_URL': f'{accounts_public_url}/auth',
        'KEYCLOAK_REALM': realm,
        'KEYCLOAK_CLIENT_ID': client_id,
        'KEYCLOAK_CLIENT_SECRET_KEY': client_secret
    }
    auth_uri = f'{accounts_public_url}/auth/realms/{realm}'
    public_uri = ''

    OIDC_OP_AUTHORIZATION_ENDPOINT = auth_uri + '/protocol/openid-connect/auth'
    OIDC_OP_TOKEN_ENDPOINT = auth_uri + '/protocol/openid-connect/token'
    OIDC_OP_USER_ENDPOINT = auth_uri + '/protocol/openid-connect/userinfo'
    LOGIN_REDIRECT_URL = public_uri + '/admin/'
    LOGOUT_REDIRECT_URL = auth_uri + '/protocol/openid-connect/logout?redirect_uri=' + public_uri
    OIDC_RP_CLIENT_ID = client_id
    OIDC_RP_CLIENT_SECRET = ''
    OIDC_RP_SCOPES = 'email openid profile'
    OIDC_RP_SIGN_ALGO = 'RS256'
    OIDC_OP_JWKS_ENDPOINT = auth_uri + '/protocol/openid-connect/certs'

    # Fields to look for in the userinfo returned from Keycloak
    OIDC_CLAIMS_VERIFICATION = 'preferred_username sub'

    # Some login changes
    LOGIN_URL = '/openid/authenticate'

    # if secured then set USE_X_FORWARDED_HOST because we are behind the GK proxy
    USE_X_FORWARDED_HOST = current_app.harness.secured
