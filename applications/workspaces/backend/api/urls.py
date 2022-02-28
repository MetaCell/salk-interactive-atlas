from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register('experiments', views.ExperimentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
