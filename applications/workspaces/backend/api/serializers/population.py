from rest_framework import serializers

from api.models import Population, AtlasesChoice, Cell
from .atlas import AtlasChoiceField


class AtlasChoiceField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": AtlasesChoice.to_str(value)}


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ("x", "y", "z")


class PopulationSerializer(serializers.ModelSerializer):
    atlas = AtlasChoiceField(read_only=True)
    cells = CellSerializer(source="cell_set", many=True, read_only=True)

    class Meta:
        model = Population
        fields = ("id", "name", "color", "atlas", "cells")
