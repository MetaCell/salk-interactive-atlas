from rest_framework import serializers

from api.models import AtlasesChoice, Population, Pdf
from api.serializers.pdf import PdfSerializer


class AtlasChoiceField(serializers.RelatedField):
    def to_representation(self, value):
        return {"role": value, "description": AtlasesChoice.to_str(value)}


class PopulationSerializer(serializers.ModelSerializer):
    pdfs = serializers.SerializerMethodField()

    class Meta:
        model = Population
        fields = (
            "id",
            "name",
            "color",
            "experiment",
            "atlas",
            "cells",
            "opacity",
            "status",
            "pdfs",
        )

    def get_pdfs(self, obj):
        pdfs = obj.pdfs if hasattr(obj, 'pdfs') else []
        return PdfSerializer(pdfs, many=True).data



