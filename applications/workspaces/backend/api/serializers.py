from rest_framework import serializers

from api.models import Experiment

class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = "__all__"