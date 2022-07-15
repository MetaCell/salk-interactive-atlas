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
from api.constants import GREY, WHITE, DARK_GREY, FULLY_OPAQUE, HALF_OPAQUE

# Build paths inside the project like this: BASE_DIR / 'subdir'.

BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-)5@5h(+e1@_h2$%1957726%e%6wt_+pwdtk2p@^71=e$*m^ew*"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False if os.environ.get("PRODUCTION", None) else True

ALLOWED_HOSTS = [
    "*",
]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "cloudharness.middleware.django.CloudharnessMiddleware",
]

ROOT_URLCONF = "workspaces.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "workspaces.wsgi.application"

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static/")

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ***********************************************************************
# * Salk settings
# ***********************************************************************
from cloudharness.applications import get_configuration
from cloudharness.utils.config import ALLVALUES_PATH, CloudharnessConfig

PROJECT_NAME = "WORKSPACES"

# Persistent storage
PERSISTENT_ROOT = os.path.join(BASE_DIR, "persistent")
LAMINAS_PATH = os.path.join(PERSISTENT_ROOT, "laminas")
ANNOTATIONS_PATH = os.path.join(PERSISTENT_ROOT, "annotation")
CANAL_PATH = os.path.join(PERSISTENT_ROOT, "canal")

# ***********************************************************************
# * import base CloudHarness Django settings
# ***********************************************************************
from cloudharness_django.settings import *

# add the local apps
INSTALLED_APPS += [
    "dry_rest_permissions",
    "workspaces",
    "api",
    "k8s",
]

# override django admin base template with a local template
# to add some custom styling
TEMPLATES[0]["DIRS"] = [BASE_DIR / "templates"]

# Django Logging Information
LOGGING = {
    # Define the logging version
    "version": 1,
    # Enable the existing loggers
    "disable_existing_loggers": False,
    # Define the handlers
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            # 'formatter': 'console',
        },
    },
    # Define the loggers
    "loggers": {
        "django": {
            "handlers": [
                "console",
            ],
            "level": "DEBUG" if DEBUG else "INFO",
            "propagate": True,
        },
    },
}

# Static files (CSS, JavaScript, Images)
MEDIA_ROOT = PERSISTENT_ROOT
STATIC_ROOT = os.path.join(BASE_DIR, "static")
MEDIA_URL = "/media/"
STATIC_URL = "/static/"
REST_FRAMEWORK.update({"UPLOADED_FILES_USE_URL": False})

# KC Client & roles
KC_CLIENT_NAME = PROJECT_NAME.lower()

# Default OIDC roles
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

KC_DEFAULT_USER_ROLE = KC_USER_ROLE  # don't add the user role to the realm default role

GREY_SCALE_MAX_DEFAULT = GREY
GREY_SCALE_MAX_CANAL = WHITE
GREY_SCALE_MAX_ANNOTATION = DARK_GREY

DEFAULT_IMAGE_OPACITY = HALF_OPAQUE
CANAL_IMAGE_OPACITY = FULLY_OPAQUE
