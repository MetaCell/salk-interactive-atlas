"""Workspaces URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include, reverse
from django.views.generic import TemplateView
from django.views.generic.base import RedirectView

from rest_framework.schemas import get_schema_view
from rest_framework.schemas.openapi import SchemaGenerator
from rest_framework import permissions
# import mozilla_django_oidc

from workspaces.views import index

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

from django.views.static import serve
urlpatterns = [
    # path('openid/', include('mozilla_django_oidc.urls')),
    # re_path(r'^admin/login/?$', RedirectView.as_view(pattern_name='oidc_authentication_init', permanent=True, query_string=True)),
    path('admin/', admin.site.urls),

    path('api/schema', get_schema_view(
        title="Workspaces",
        description="API for all workspaces...",
        version="0.0.1",
        generator_class=SecuredOpenApiGenerator,
    ), name='openapi-schema'),

    path('api/ui', TemplateView.as_view(
        template_name='workspaces/swagger-ui.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='swagger-ui'),

    path('api/', include("api.urls")),
    path('k8s/', include("k8s.urls")),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
# urlpatterns += [re_path(r'^(?P<path>.*)$', index, name='index')]


# handler404 = 'workspaces.views.view_404'

admin.site.site_header = 'Workspaces Admin'
admin.site.site_title = 'Workspaces Admin'
admin.site.index_title = 'Index'
