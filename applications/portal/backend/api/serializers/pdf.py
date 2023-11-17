from rest_framework import serializers
from api.models import Pdf, PDFCategory
import os


def create_pages_dict(dir_to_search):
	png_files = [f for f in os.listdir(dir_to_search) if f.endswith('.png')]
	png_files.sort()
	pages = {}
	for png_file in png_files:
		page_number = png_file.split('.')[0]
		pages[page_number] = os.path.join(dir_to_search, png_file)
	return pages

		

class PdfSerializer(serializers.ModelSerializer):
	pages = serializers.SerializerMethodField()

	class Meta:
		model = Pdf
		fields = (
			"id",
			"name",
			"created_at",
			"created_by",
			"category",
			"pages"
		)

	def get_pages(self, pdf_obj):
		population = pdf_obj.population
		population_storage_path = population.storage_path
		category_dir = os.path.join(population_storage_path, 'pdf', pdf_obj.category)
		dir_to_search = os.path.join(category_dir, str(pdf_obj.id))

		return create_pages_dict(dir_to_search)
