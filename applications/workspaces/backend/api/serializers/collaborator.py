from rest_framework import serializers

from api.models import Collaborator, CollaboratorRole
from kcoidc.serializers import UserSerializer


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
