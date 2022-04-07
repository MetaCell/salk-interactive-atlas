from rest_framework import serializers

from api.models import AtlasesChoice, Population

from .atlas import AtlasChoiceField


class AtlasChoiceField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": AtlasesChoice.to_str(value)}

class PopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Population
        fields = ("id", "name", "color", "experiment", "atlas", "cells", "opacity")
