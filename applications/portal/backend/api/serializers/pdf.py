from rest_framework import serializers
from api.models import Pdf, PDFCategory
import os


class PdfSerializer(serializers.ModelSerializer):
	created_by = serializers.SerializerMethodField()
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

	def get_created_by(self, obj):
		return obj.created_by.first_name + " " + obj.created_by.last_name
