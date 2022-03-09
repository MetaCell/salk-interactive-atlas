from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import Experiment, Collaborator, CollaboratorRole
from kcoidc.serializers import UserSerializer, GroupSerializer

class CollaboratorRoleField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": CollaboratorRole.to_str(value)}

class CollaboratorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    role = CollaboratorRoleField(read_only=True)
    class Meta:
        model = Collaborator
        fields = ("user","role",)

class ExperimentSerializer(serializers.ModelSerializer):
    teams = GroupSerializer(many=True, read_only=True)
    collaborators = CollaboratorSerializer(source='collaborator_set', many=True, read_only=True)
    class Meta:
        model = Experiment
        fields = ("name","date_created","description","is_private","teams","collaborators")


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id","name")


class UserTeamSerializer(serializers.ModelSerializer):
    groups = TeamSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ("id","username","first_name","last_name","email","groups")
