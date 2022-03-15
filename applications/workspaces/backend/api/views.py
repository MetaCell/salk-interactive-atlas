import logging
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from django.contrib.auth.models import User, Group

from api.models import Experiment, CollaboratorRole
from api.serializers import \
    ExperimentSerializer, ExperimentFileUploadSerializer, UserTeamSerializer, \
    TeamSerializer, MemberSerializer, UserSerializer

from kcoidc.models import Team, Member
from kcoidc.services import get_user_service


log = logging.getLogger('__name__')

class ExperimentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Experiment.objects.all()
    parser_classes = (MultiPartParser,)

    def get_serializer_class(self):
        if self.action == 'upload_file':
            return ExperimentFileUploadSerializer
        return ExperimentSerializer

    def has_access(self, experiment, user):
        # public experiments, user is owner or user is member of team of the experiment
        return not experiment.is_private or \
               self.has_write_access(experiment, user)

    def has_write_access(self, experiment, user):
        # user is owner or user is member of team of the experiment
        return  experiment.owner == user or \
                (experiment.teams and \
                    len(experiment.teams.filter(team__group__user=user))>0 \
                ) or \
                (experiment.collaborators and \
                    len(experiment.collaborator_set.filter(user=user.id, role=CollaboratorRole.EDITOR))>0
                )

    def public_experiments(self):
        return self.get_queryset().filter(
            is_private=False # all public experiments
        )

    def my_experiments(self):
        return self.get_queryset().filter(
            owner=self.request.user # my experiments
        )

    def team_experiments(self):
        return self.get_queryset().filter(
            teams__user=self.request.user # my teams experiments
        ).distinct()

    def collaborate_experiments(self):
        return self.get_queryset().filter(
            collaborators__collaborator__user=self.request.user # my teams experiments
        )

    def list(self, request):
        queryset = self.filter_queryset(
            self.my_experiments() \
                .union(self.team_experiments()) \
                .union(self.public_experiments()) \
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

    @action(
        detail=True,
        methods=['post'],
        parser_classes=(MultiPartParser, ),
        name='experiment-upload-file',
        url_path='upload-file',)
    def upload_file(self, request, **kwargs):
        # Code to handle file
        #has permission_classes
        #save file
        #process file
        pass

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
    serializer_class = UserTeamSerializer
    queryset = User.objects.all()

    def list(self, request):
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
    queryset = Group.objects.all()

    def get_serializer_class(self):
        if self.action == 'add_members':
            return MemberSerializer
        return TeamSerializer


    def is_team_manager(self, group, user):
        return len(group.user_set.filter(id=user.id))>0

    def list(self, request):
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
    def members(self, request, pk, **kwargs):
        instance = self.get_object()
        if not self.is_team_manager(instance, request.user):
            raise PermissionDenied

        serializer = UserSerializer(instance.user_set.all(), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], name='add_members')
    def add_members(self, request, pk, **kwargs):
        instance = self.get_object()
        if not self.is_team_manager(instance, request.user):
            raise PermissionDenied

        # POST action --> add member
        user_id = request.data.get("user_id")
        already_member = len(instance.user_set.filter(id=user_id))>0
        if not already_member:
            new_member = User.objects.get(id=user_id)
            get_user_service().add_user_to_team(new_member, instance.name)
            instance.user_set.add(new_member)
            instance.save()
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'],url_path="members/(?P<user_id>[^/.]+)",url_name="del_member")
    def del_member(self, request, user_id, **kwargs):
        instance = self.get_object()
        if self.is_team_manager(instance, request.user):
            is_member = len(instance.user_set.filter(id=user_id))>0
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
            owner=self.request.user, # set the owner of the team
            kc_id=kc_group["id"],
            group=group)
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
