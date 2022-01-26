from django.urls import path, include
from rest_framework.routers import DefaultRouter
from experiment import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register('', views.ExperimentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
