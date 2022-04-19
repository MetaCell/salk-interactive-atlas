from cloudharness_django.serializers import GroupSerializer
from rest_framework import serializers

from api.models import Experiment
from .cell import CellSerializer

from .collaborator import CollaboratorInfoSerializer
from .population import PopulationSerializer
from .tag import TagSerializer
from .user import UserTeamSerializer


class DensityMapSerializer(serializers.Serializer):
    atlas = serializers.CharField()
    cells = CellSerializer(many=True, read_only=True)

    class Meta:
        model = Experiment
        fields = ()


class ExperimentFileUploadSerializer(serializers.Serializer):
    population_name = serializers.CharField()
    file = serializers.FileField()

    class Meta:
        model = Experiment
        fields = ()


class ExperimentSerializer(serializers.ModelSerializer):
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
        )
