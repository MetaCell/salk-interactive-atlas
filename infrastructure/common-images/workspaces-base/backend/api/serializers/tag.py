from rest_framework import serializers

from api.models import Tag


class StringListField(serializers.ListField):
    child = serializers.CharField()


class TagsSerializer(serializers.ModelSerializer):
    tags = StringListField()

    class Meta:
        model = Tag
        fields = (
            "tags",
        )


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "name",
        )
