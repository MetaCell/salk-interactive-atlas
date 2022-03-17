from django.urls import include, path
from rest_framework.routers import DefaultRouter

import api.views.rest as rest_views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register("experiments", rest_views.ExperimentViewSet)
router.register("users", rest_views.UserViewSet)
router.register("userdetails", rest_views.UserDetailViewSet)
router.register("teams", rest_views.GroupViewSet)
router.register("tags", rest_views.TagViewSet)
router.register("collaborator", rest_views.CollaboratorViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
