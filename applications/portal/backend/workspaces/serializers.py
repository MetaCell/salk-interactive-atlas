from rest_framework import serializers

from django.contrib.auth.models import User, Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id","name",)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","first_name","last_name","email")

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id","name")