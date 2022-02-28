"""
Django settings for workspaces project.

Generated by 'django-admin startproject' using Django 4.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-)5@5h(+e1@_h2$%1957726%e%6wt_+pwdtk2p@^71=e$*m^ew*'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*',]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'workspaces.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'workspaces.wsgi.application'


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT= os.path.join(BASE_DIR,'static/')


# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'workspaces.auth.BearerAuthentication',
    ]
}


# ***********************************************************************
# * Salk settings
# ***********************************************************************
from cloudharness.applications import get_configuration
from cloudharness.utils.config import CloudharnessConfig, ALLVALUES_PATH


# add the 3rd party apps
INSTALLED_APPS += [
    'rest_framework',
    'mozilla_django_oidc',
    'admin_extra_buttons',
]


# add the local apps
INSTALLED_APPS += [
    "workspaces",
    "api",
    "k8s",
]


# add the CH authentication middleware
MIDDLEWARE += [
    'cloudharness.middleware.django.CloudharnessMiddleware',
]


# override django admin base template with a local template
# to add some custom styling
TEMPLATES[0]['DIRS'] = [BASE_DIR / 'templates']


# Persistent storage
PERSISTENT_ROOT = os.path.join(BASE_DIR, 'persistent')


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(PERSISTENT_ROOT, 'salk.sqlite3')
    },
}


# Static files (CSS, JavaScript, Images)
MEDIA_ROOT = PERSISTENT_ROOT
STATIC_ROOT= os.path.join(BASE_DIR,'static')
MEDIA_URL = '/media/'
STATIC_URL = '/static/'


# Keycloak Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES' : [
        'mozilla_django_oidc.contrib.drf.OIDCAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    # 'DEFAULT_AUTHENTICATION_CLASSES': [
    #     'workspaces.auth.BearerAuthentication',
    # ]
}
AUTHENTICATION_BACKENDS = ['workspaces.auth.WorkspacesOIDCAB',]


# test if the kubernetes CH all values exists, if so then set up the OIDC config
# IMPROTANT NOTE:
#   when testing/debugging copy the deployment/helm/values.yaml to the ALLVALUES_PATH
if os.path.isfile(ALLVALUES_PATH):
    # try to setup the env needed to run

    # get the application CH configs
    accounts_app = get_configuration("accounts")
    current_app = get_configuration("workspaces")

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
    auth_uri = f"{accounts_public_url}/auth/realms/{realm}"
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

    # Allow this user to not have an email address during OIDC claims verification.
    KEYCLOAK_ADMIN_USER = 'mnp'

    # Some login changes
    LOGIN_URL = '/openid/authenticate'

    # if secured then set USE_X_FORWARDED_HOST because we are behind the GK proxy
    USE_X_FORWARDED_HOST = current_app.harness.secured
