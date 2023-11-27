from rest_framework import serializers
from api.models import Pdf, PDFCategory
import os


class PdfSerializer(serializers.ModelSerializer):
	class Meta:
		model = Pdf
		fields = (
			"id",
			"name",
			"category",
			"created_at",
			"created_by",
			"file"
		)
