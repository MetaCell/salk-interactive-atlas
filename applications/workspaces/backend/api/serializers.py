from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import Experiment, Collaborator, CollaboratorRole, Population, AtlasesChoice, Tag, UserDetail, Cell
from kcoidc.serializers import UserSerializer, GroupSerializer


class UserDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserDetail
        fields = "__all__"


class CollaboratorRoleField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": CollaboratorRole.to_str(value)}


class CollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaborator
        fields = "__all__"


class CollaboratorInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Collaborator
        fields = ("id", "user", "shared_on", "role")


class ExperimentFileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    class Meta:
        model = Experiment
        fields = ()


class MemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id","name")


class UserTeamSerializer(serializers.ModelSerializer):
    groups = TeamSerializer(many=True, read_only=True)
    avatar = serializers.CharField(source="userdetail.avatar.url")

    class Meta:
        model = User
        fields = ("id","username","first_name","last_name","email","groups", "avatar")


class AtlasChoiceField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": AtlasesChoice.to_str(value)}


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ("x","y","z")


class PopulationSerializer(serializers.ModelSerializer):
    atlas = AtlasChoiceField(read_only=True)
    cells = CellSerializer(source='cell_set', many=True, read_only=True)

    class Meta:
        model = Population
        fields = ("id", "name", "color", "atlas", "cells")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name",)


class ExperimentSerializer(serializers.ModelSerializer):
    teams = GroupSerializer(many=True, read_only=True)
    collaborators = CollaboratorInfoSerializer(source='collaborator_set', many=True, read_only=True)
    owner = UserTeamSerializer(many=False, read_only=True)
    populations = PopulationSerializer(source='population_set', many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    date_created = serializers.CharField(read_only=True)

    class Meta:
        model = Experiment
        fields = (
            "id", "name", "is_private", "description", "date_created", "last_modified", "owner", "teams",
            "collaborators",
            "populations", 'tags')