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
            'admin_extra_buttons',]

# add the local apps
INSTALLED_APPS += ['kcoidc',]

# add the KCOIDC auto login middleware
MIDDLEWARE = getattr(
            settings,
            'MIDDLEWARE',
            []
    ) + [
        'kcoidc.middleware.AutomaticLoginUserMiddleware',
    ]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'kcoidc.middleware.AutomaticLoginUserMiddlewareOIDC',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# from rest_framework.authentication import SessionAuthentication

# test if the kubernetes CH all values exists, if so then set up specific k8s stuff
# IMPROTANT NOTE:
#   when testing/debugging copy the deployment/helm/values.yaml to the ALLVALUES_PATH
#   see also the README.md
if os.path.isfile(ALLVALUES_PATH):
    # try to setup the env needed to run

    # get the application CH config
    current_app = get_current_configuration()

    # if secured then set USE_X_FORWARDED_HOST because we are behind the GK proxy
    USE_X_FORWARDED_HOST = current_app.harness.secured
