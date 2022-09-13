from workspaces.serializers import GroupSerializer
from rest_framework import serializers

from api.models import Experiment

from .collaborator import CollaboratorInfoSerializer
from .population import PopulationSerializer
from .tag import TagSerializer
from .user import UserTeamSerializer


class EagerLoadingMixin:
    @classmethod
    def setup_eager_loading(cls, queryset):
        """
        This function allow dynamic addition of the related objects to
        the provided query.
        @parameter param1: queryset
        """

        if hasattr(cls, "select_related_fields"):
            queryset = queryset.select_related(*cls.select_related_fields)
        if hasattr(cls, "prefetch_related_fields"):
            queryset = queryset.prefetch_related(*cls.prefetch_related_fields)
        return queryset


class IntegerListField(serializers.ListField):
    child = serializers.IntegerField()


class ExperimentFileUploadSerializer(serializers.Serializer):
    key_file = serializers.FileField()
    data_file = serializers.FileField()

    class Meta:
        model = Experiment
        fields = ()


class ExperimentSerializer(serializers.ModelSerializer, EagerLoadingMixin):
    teams = GroupSerializer(many=True, read_only=True)
    collaborators = CollaboratorInfoSerializer(
        source="collaborator_set", many=True, read_only=True
    )
    owner = UserTeamSerializer(many=False, read_only=True)
    populations = PopulationSerializer(
        source="population_set", many=True, read_only=True
    )
    tags = TagSerializer(many=True, read_only=True)
    date_created = serializers.CharField(read_only=True)
    has_edit_permission = serializers.SerializerMethodField()

    select_related_fields = (
        "owner",
        "owner__userdetail",
    )
    prefetch_related_fields = (
        "teams",
        "collaborator_set",
        "population_set",
        "tags",
        "owner__groups",
    )

    class Meta:
        model = Experiment
        fields = (
            "id",
            "name",
            "is_private",
            "description",
            "date_created",
            "last_modified",
            "owner",
            "teams",
            "collaborators",
            "populations",
            "tags",
            "has_edit_permission",
        )

    def get_has_edit_permission(self, obj):
        return obj.has_object_write_permission(self.context["request"])
