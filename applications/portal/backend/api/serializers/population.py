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
        request = self.context.get("request")

        # Check if there's an experiment ID in the request
        experiment_id = request.query_params.get("experiment") if request else None

        if experiment_id:
            pdfs = obj.population_pdf.filter(
                experiment_id=experiment_id,
            ).order_by("-created_at")
        else:
            pdfs = Pdf.objects.none()

        return PdfSerializer(pdfs, many=True).data



