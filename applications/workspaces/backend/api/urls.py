from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("experiments", views.ExperimentViewSet)
router.register("users", views.UserViewSet)
router.register("userdetails", views.UserDetailViewSet)
router.register("teams", views.GroupViewSet)
router.register("tags", views.TagViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
