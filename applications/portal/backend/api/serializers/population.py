from rest_framework import serializers

from api.models import AtlasesChoice, Population, PDFCategory
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
        # if not obj.experiment:  # return pdfs created by the user for residential population
        pdfs = obj.population_pdf.filter(
            created_by=self.context["request"].user
        ).order_by("-created_at")
        # else:
        #     pdfs = obj.population_pdf.all().order_by("-created_at")
        return PdfSerializer(pdfs, many=True).data



class PopulationPDFUploadSerializer(serializers.Serializer):
    pdf_file = serializers.FileField(required=True)
    category = serializers.ChoiceField(
        choices=PDFCategory.choices, required=True
    )

    # Think more on the below code, if that is needed or not
    class Meta:
        model = Population
        fields = ()
