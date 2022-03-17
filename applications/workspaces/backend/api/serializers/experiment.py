from rest_framework import serializers

from api.models import Experiment
from kcoidc.serializers import GroupSerializer

from .collaborator import CollaboratorInfoSerializer
from .population import PopulationSerializer
from .tag import TagSerializer
from .user import UserTeamSerializer


class ExperimentFileUploadSerializer(serializers.Serializer):
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
