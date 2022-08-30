from workspaces.serializers import UserSerializer
from django.contrib.auth.models import Group, User
from rest_framework import serializers

from api.models import UserDetail


class UserDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserDetail
        fields = "__all__"


class MemberSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name")


class UserTeamSerializer(serializers.ModelSerializer):
    groups = TeamSerializer(many=True, read_only=True)
    avatar = serializers.CharField(source="userdetail.avatar")

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "groups",
            "avatar",
        )
