from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from django.contrib.auth.models import User, Group

from api.models import Experiment, CollaboratorRole, Tag
from api.serializers import ExperimentSerializer, UserTeamSerializer, TeamSerializer, TagSerializer

from kcoidc.models import Team, Member
from kcoidc.serializers import UserSerializer
from kcoidc.services import get_user_service


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ExperimentSerializer
    queryset = Experiment.objects.all()

    def has_access(self, experiment, user):
        # public experiments, user is owner or user is member of team of the experiment
        return not experiment.is_private or \
               self.has_write_access(experiment, user)

    def has_write_access(self, experiment, user):
        # user is owner or user is member of team of the experiment
        return experiment.owner == user or \
               (experiment.teams and len(experiment.teams.filter(team__group__user=user)) > 0) or \
               (experiment.collaborators and len(
                   experiment.collaborator_set.filter(user=user.id, role=CollaboratorRole.EDITOR)) > 0)

    def public_experiments(self):
        return self.get_queryset().filter(
            is_private=False  # all public experiments
        )

    def my_experiments(self):
        return self.get_queryset().filter(
            owner=self.request.user  # my experiments
        )

    def team_experiments(self):
        return self.get_queryset().filter(
            teams__user=self.request.user  # my teams experiments
        )

    def collaborate_experiments(self):
        return self.get_queryset().filter(
            collaborators__collaborator__user=self.request.user  # my teams experiments
        )

    def list(self, request, **kwargs):
        queryset = self.filter_queryset(
            self.my_experiments()
                .union(self.team_experiments())
                .union(self.public_experiments())
                .union(self.collaborate_experiments())
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def mine(self, request):
        queryset = self.filter_queryset(
            self.my_experiments()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def public(self, request):
        queryset = self.filter_queryset(
            self.public_experiments()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def myteams(self, request):
        queryset = self.filter_queryset(
            self.team_experiments()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def sharedwithme(self, request):
        queryset = self.filter_queryset(
            self.collaborate_experiments()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path="tag", url_name="tag_add")
    def add_tag(self, request, pk=None):
        instance = self.get_object()
        if self.has_access(instance, request.user):
            experiment_has_tag = len(instance.tag_set.filter(id=request.tag.id)) > 0
            if not experiment_has_tag:
                new_tag = Tag.objects.get(id=request.tag.id)
                instance.tag_set.add(new_tag)
                instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # user doesn't have access to experiment
            raise PermissionDenied()    \


    @action(detail=True, methods=['delete'], url_path="tag", url_name="tag_delete")
    def delete_tag(self, request, pk=None):
        instance = self.get_object()
        if self.has_access(instance, request.user):
            instance.tag_set.filter(id=request.tag.id).delete()
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # user doesn't have access to experiment
            raise PermissionDenied()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.has_access(instance, request.user):
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # no rights to retrieve
            raise PermissionDenied()

    def perform_create(self, serializer):
        experiment = serializer.save(
            owner=self.request.user,
        )

    def perform_update(self, serializer, *args, **kwargs):
        instance = serializer.instance
        if self.has_write_access(instance, self.request.user):
            serializer.save()
        else:
            # no rights to update
            raise PermissionDenied()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.has_access(instance, self.request.user):
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            # not the owner so not rights to delete
            raise PermissionDenied()


class UserViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list` actions.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserTeamSerializer
    queryset = User.objects.all()

    def list(self, request, **kwargs):
        if not request.user.is_superuser:
            # no super user so return only the current user
            queryset = self.filter_queryset(self.get_queryset()).filter(id=request.user.id)
        else:
            # super user can query all users
            queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class GroupViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` actions.

    Additionally we also provide extra `magic` actions `members`,
    `members add` and `members delete`.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TeamSerializer
    queryset = Group.objects.all()

    def is_team_manager(self, group, user):
        return len(group.user_set.filter(id=user.id)) > 0

    def list(self, request, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(team__owner=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # raise 404 not found if the team doesn't exists
            raise PermissionDenied

    @action(detail=True, methods=['get'])
    def members(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            serializer = UserSerializer(instance.user_set.all(), many=True)
            return Response(serializer.data)
        else:
            # raise 404 not found if the team doesn't exists
            raise PermissionDenied

    @action(detail=True, methods=['post'], url_path="members/(?P<user_id>[^/.]+)", url_name="members_add")
    def add_member(self, request, user_id, pk=None):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            already_member = len(instance.user_set.filter(id=user_id)) > 0
            if not already_member:
                new_member = User.objects.get(id=user_id)
                get_user_service().add_user_to_team(new_member, instance.name)
                instance.user_set.add(new_member)
                instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            # user is not a team manager of team
            raise PermissionDenied()

    @action(detail=False, methods=['delete'], url_path="(?P<id>[^/.]+)/members/(?P<user_id>[^/.]+)",
            url_name="members_del")
    def del_member(self, request, id, user_id):
        instance = Group.objects.get(id=id)
        if self.is_team_manager(instance, request.user):
            is_member = len(instance.user_set.filter(id=user_id)) > 0
            if is_member:
                new_member = User.objects.get(id=user_id)
                get_user_service().rm_user_from_team(new_member, instance.name)
                instance.user_set.remove(new_member)
                instance.save()
            else:
                # user is not a member of the team, raise a 404 error
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
            group=group)
        team.save()
        # add the user to the team
        get_user_service().add_user_to_team(self.request.user, group.name)

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
