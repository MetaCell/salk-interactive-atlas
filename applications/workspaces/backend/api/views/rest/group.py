import logging

from cloudharness_django.models import Member, Team
from cloudharness_django.serializers import UserSerializer
from cloudharness_django.services import get_user_service
from django.contrib.auth.models import Group, User
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from api.serializers import MemberSerializer, TeamSerializer

log = logging.getLogger("__name__")


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
