import PIL.ImageOps
import os
from api.services.filesystem_service import create_dir_if_not_exists
import uuid
from api.helpers.exceptions import InvalidPDFFile

PDF_SAVED_EXTENSION = '.pdf'


def get_pdf_save_dir(save_dir, pdf_obj):
	pdf_storage_dir = os.path.join(
		save_dir, 'pdf'
	)
	dir_exists = create_dir_if_not_exists(pdf_storage_dir)
	return f'{pdf_storage_dir}/{pdf_obj.id}{PDF_SAVED_EXTENSION}'


def save_pdf_file(pdf_file, save_dir, pdf_obj):

	if pdf_file.name.endswith(PDF_SAVED_EXTENSION):
		pdf_save_dir = get_pdf_save_dir(save_dir, pdf_obj)
		with open(pdf_save_dir, 'wb+') as destination:
			for chunk in pdf_file.chunks():
				destination.write(chunk)
	else:
		raise InvalidPDFFile()

	return pdf_save_dir


def convert_and_save_pdf_to_png(pdf_obj, population_storage_path, pdf_file):

	pdf_saved_filepath = save_pdf_file(pdf_file, population_storage_path, pdf_obj)
	return pdf_saved_filepath
