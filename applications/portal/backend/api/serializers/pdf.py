from rest_framework import serializers

from api.models import Pdf, Experiment, Population


class PdfSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=True)
    created_by = serializers.SerializerMethodField()
    experiment = serializers.PrimaryKeyRelatedField(
        queryset=Experiment.objects.all(),
        required=True
    )
    population = serializers.PrimaryKeyRelatedField(
        queryset=Population.objects.all(),
        required=True
    )
    name = serializers.CharField(read_only=True)

    class Meta:
        model = Pdf
        fields = (
            "id",
            "name",
            "category",
            "created_at",
            "created_by",
            "file",
            "experiment",
            "population",
        )

    def get_created_by(self, obj):
        return obj.created_by.first_name + " " + obj.created_by.last_name
