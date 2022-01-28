"""workspaces URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView, RedirectView

from rest_framework.schemas import get_schema_view
from rest_framework.schemas.openapi import SchemaGenerator

class SecuredOpenApiGenerator(SchemaGenerator):
    def get_schema(self, *args, **kwargs):
        schema = super().get_schema(*args, **kwargs)
        schema["components"].update({
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        })
        schema["security"] = [
          {
              "bearerAuth": []
          }
        ]
        return schema

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/schema', get_schema_view(
        title="Workspaces",
        description="API for all experiments...",
        version="0.0.1",
        generator_class=SecuredOpenApiGenerator
    ), name='openapi-schema'),

    path('api/ui', TemplateView.as_view(
        template_name='workspaces/swagger-ui.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='swagger-ui'),

    path('', RedirectView.as_view(url='/api/ui', permanent=True)),

    path('api/experiment/', include("experiment.urls")),
]
