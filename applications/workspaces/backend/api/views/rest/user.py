import logging

from django.contrib.auth.models import User
from dry_rest_permissions.generics import DRYPermissions
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import UserDetail
from api.serializers import UserDetailSerializer, UserTeamSerializer

log = logging.getLogger("__name__")


class UserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    serializer_class = UserTeamSerializer
    queryset = User.objects.all()

    def list(self, request, **kwargs):
        if not request.user.is_superuser:
            # no super user so return only the current user
            queryset = self.filter_queryset(self.get_queryset()).filter(
                id=request.user.id
            )
        else:
            # super user can query all users
            queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserDetailViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` actions.

    The list action will always return the current user's userdetail as a list
    or an empty list if the current user has no userdetail
    """

    permission_classes = (DRYPermissions,)
    serializer_class = UserDetailSerializer
    queryset = UserDetail.objects.all()

    custom_serializer_map = {
        "list": UserDetailSerializer,
    }

    def list(self, *args, **kwargs):
        try:
            userdetail = [self.request.user.userdetail]
        except UserDetail.DoesNotExist:
            userdetail = []
        serializer = self.get_serializer(userdetail, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="me", url_name="me")
    def me(self, request):
        try:
            userdetail = self.request.user.userdetail
        except UserDetail.DoesNotExist or AttributeError:
            userdetail = None
        serializer = self.get_serializer(userdetail, many=False)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        try:
            userdetail = self.request.user.userdetail
            # return forbidden if the user has already a userdetail
            return Response(status=status.HTTP_403_FORBIDDEN)
        except:
            pass
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
        )
