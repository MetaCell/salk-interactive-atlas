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
        # pdf has foreign key to population, so we can use reverse relation
        pdfs = obj.population_pdf.all()
        return PdfSerializer(pdfs, many=True).data



class PopulationPDFUploadSerializer(serializers.Serializer):
    pdf_file = serializers.FileField()
    category = serializers.ChoiceField(choices=PDFCategory.choices)

    # Think more on the below code, if that is needed or not
    class Meta:
        model = Population
        fields = ()
