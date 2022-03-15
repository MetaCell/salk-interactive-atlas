import logging
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User, Group
from dry_rest_permissions.generics import DRYPermissions
from api.models import Experiment, CollaboratorRole, Tag
from api.serializers import (
    ExperimentSerializer,
    ExperimentFileUploadSerializer,
    UserTeamSerializer,
    TeamSerializer,
    MemberSerializer,
    TagSerializer
)

from kcoidc.models import Team, Member
from kcoidc.serializers import UserSerializer
from kcoidc.services import get_user_service

log = logging.getLogger("__name__")


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    permission_classes = (DRYPermissions,)
    queryset = Experiment.objects.all()
    parser_classes = (MultiPartParser,)
    custom_serializer_map = {
        "upload_file": ExperimentFileUploadSerializer,
        "add_tag": TagSerializer
    }

    def get_serializer_class(self):
        if self.action in self.custom_serializer_map.keys():
            return self.custom_serializer_map[self.action]
        return ExperimentSerializer

    def list(self, request, **kwargs):
        queryset = Experiment.objects.list(request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def mine(self, request):
        queryset = Experiment.objects.my_experiments(request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def public(self, request):
        queryset = Experiment.objects.public_experiments()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def myteams(self, request):
        queryset = Experiment.objects.team_experiments(request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def sharedwithme(self, request):
        queryset = Experiment.objects.collaborate_experiments(request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="tag", url_name="tag_add")
    def add_tag(self, request, pk):
        instance = self.get_object()
        tag_name = request.data.get("name")
        try:
            tag = instance.tags.get(name=tag_name)
        except Tag.DoesNotExist:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)
            instance.save()

        serializer = self.get_serializer(tag)
        return Response(serializer.data)

    @action(detail=True, methods=["delete"], url_path="tag/(?P<tag_name>[^/.]+)", url_name="tag_delete")
    def delete_tag(self, request, tag_name, **kwargs):
        instance = self.get_object()
        try:
            tag = instance.tags.get(name=tag_name)
            instance.tags.remove(tag)
            instance.save()
        except Tag.DoesNotExist:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        parser_classes=(MultiPartParser,),
        name="experiment-upload-file",
        url_path="upload-file",
    )
    def upload_file(self, request, **kwargs):
        # Code to handle file
        # has permission_classes
        # save file
        # process file
        pass

    def perform_create(self, serializer):
        experiment = serializer.save(
            owner=self.request.user,
        )



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


class GroupViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` actions.

    Additionally we also provide extra `magic` actions `members`,
    `members add` and `members delete`.
    """

    queryset = Group.objects.all()

    def get_serializer_class(self):
        if self.action == "add_members":
            return MemberSerializer
        return TeamSerializer

    def is_team_manager(self, group, user):
        return len(group.user_set.filter(id=user.id)) > 0

    def list(self, request, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            team__owner=request.user
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # raise 404 not found if the team doesn"t exists
            raise PermissionDenied

    @action(detail=True, methods=["get"])
    def members(self, request, pk, **kwargs):
        instance = self.get_object()
        if not self.is_team_manager(instance, request.user):
            raise PermissionDenied

        serializer = UserSerializer(instance.user_set.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], name="add_members")
    def add_members(self, request, pk, **kwargs):
        instance = self.get_object()
        if not self.is_team_manager(instance, request.user):
            raise PermissionDenied

        # POST action --> add member
        user_id = request.data.get("user_id")
        already_member = len(instance.user_set.filter(id=user_id)) > 0
        if not already_member:
            new_member = User.objects.get(id=user_id)
            get_user_service().add_user_to_team(new_member, instance.name)
            instance.user_set.add(new_member)
            instance.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(
        detail=True,
        methods=["delete"],
        url_path="members/(?P<user_id>[^/.]+)",
        url_name="del_member",
    )
    def del_member(self, request, user_id, **kwargs):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            is_member = len(instance.user_set.filter(id=user_id)) > 0
            if is_member:
                new_member = User.objects.get(id=user_id)
                get_user_service().rm_user_from_team(new_member, instance.name)
                instance.user_set.remove(new_member)
                instance.save()
            else:
                # user is not a member of the team, rais a 404 error
                raise PermissionDenied()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            # user is not a team manager of team
            raise PermissionDenied()

    def perform_create(self, serializer):
        group = serializer.save()
        kc_group = get_user_service().create_team(group.name)
        team = Team.objects.create(
            owner=self.request.user,  # set the owner of the team
            kc_id=kc_group["id"],
            group=group,
        )
        team.save()
        # add the user to the team
        try:
            get_user_service().add_user_to_team(self.request.user, group.name)
        except Member.DoesNotExist:
            pass

    def perform_update(self, serializer):
        if self.is_team_manager(serializer.instance, self.request.user):
            group = serializer.save()
            get_user_service().update_team(group)
        else:
            # user is not a team manager of team
            raise PermissionDenied()


class TagViewSet(mixins.ListModelMixin,
                 viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
