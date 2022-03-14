"""
ASGI config for workspaces project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'workspaces.settings')

application = get_asgi_application()

# init the auth service
from kcoidc.services import init_services
init_services()

# start the kafka event listener
import kcoidc.services.events
