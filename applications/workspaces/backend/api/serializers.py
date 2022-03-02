from rest_framework import serializers

from django.contrib.auth.models import User, Group

from api.models import Experiment, Collaborator

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class CollaboratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collaborator
        fields = ("collaborator2__experiment",)

class ExperimentSerializer(serializers.ModelSerializer):
    teams = GroupSerializer(many=True, read_only=True)
    collaborators = CollaboratorSerializer(many=True, read_only=True)
    class Meta:
        model = Experiment
        fields = ("name","date_created","description","is_private","teams","collaborators")


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id","name")


class UserSerializer(serializers.ModelSerializer):
    groups = TeamSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ("id","username","first_name","last_name","email","groups")
