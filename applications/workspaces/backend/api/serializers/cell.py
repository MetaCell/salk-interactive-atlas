from rest_framework import serializers
from api.models.cell import Cell


class CellSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cell
        fields = ("x", "y", "z")
