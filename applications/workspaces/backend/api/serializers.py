from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import Experiment, Collaborator, CollaboratorRole, Population, AtlasesChoice, Tag, SalkUser
from kcoidc.serializers import UserSerializer, GroupSerializer



class SalkUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SalkUser
        fields = ("user", )


class CollaboratorRoleField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": CollaboratorRole.to_str(value)}


class CollaboratorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = CollaboratorRoleField(read_only=True)

    class Meta:
        model = Collaborator
        fields = (
            "user",
            "role",
        )



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

    class Meta:
        model = User
        fields = ("id","username","first_name","last_name","email","groups")


class AtlasChoiceField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": AtlasesChoice.to_str(value)}


class PopulationSerializer(serializers.ModelSerializer):
    atlas = AtlasChoiceField(read_only=True)

    class Meta:
        model = Population
        fields = ("id", "name", "color", "atlas")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name",)


class ExperimentSerializer(serializers.ModelSerializer):
    teams = GroupSerializer(many=True, read_only=True)
    collaborators = CollaboratorSerializer(source='collaborator_set', many=True, read_only=True)
    owner = UserTeamSerializer(many=False, read_only=True)
    populations = PopulationSerializer(source='population_set', many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Experiment
        fields = (
            "id", "name", "is_private", "description", "date_created", "last_modified", "owner", "teams",
            "collaborators",
            "populations", 'tags')