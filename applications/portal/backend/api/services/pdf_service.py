from PIL import Image
from pdf2image import convert_from_path
import PIL.ImageOps
import tempfile
import os
import pathlib
from api.utils import create_dir_if_not_exists
from api.models import PDFCategory


IMG_QUALITY_IN_DPI = 250
IMG_SAVED_EXTENSION = '.png'


def inverted_background_data(rgba):
	datas = rgba.getdata()
	BACKGROUND_COLOR = (0, 0, 0)
	new_rgba_data = []
	for item in datas:
		if item[0] == BACKGROUND_COLOR[0] and item[1] == BACKGROUND_COLOR[1] and item[2] == BACKGROUND_COLOR[2]:
			# storing a transparent value when we find a black colour
			new_rgba_data.append((255, 255, 255, 0))
		else:
			new_rgba_data.append(item)  # other colours remain unchanged
	return new_rgba_data

def invert_image_operation(image_obj):
	image = image_obj.convert('RGB')
	inverted_image = PIL.ImageOps.invert(image)
	rgba = inverted_image.convert("RGBA")
	inverted_bg_data = inverted_background_data(rgba)
	rgba.putdata(inverted_bg_data)
	return rgba

def save_inverted_image(images_from_pdf, save_dir):
	for page in images_from_pdf:
		inverted_image = invert_image_operation(page)
		page_filename = str(images_from_pdf.index(page)+1) + IMG_SAVED_EXTENSION
		file_dir_by_page = os.path.join(save_dir, page_filename)
		inverted_image.save(file_dir_by_page)

def save_pdf_file(pdf_file, save_dir):
	pdf_save_dir = f'{save_dir}/{pdf_file.name}'
	with open(pdf_save_dir, 'wb+') as destination:
		for chunk in pdf_file.chunks():
			destination.write(chunk)

	return pdf_save_dir

def is_pdf_category(text):
    return text in [PDFCategory.ELECTROPHYSIOLOGY, PDFCategory.BEHAVIOUR, PDFCategory.IO_MAPPING]


# SAVED HERE - /population/<p_id>/pdf/<category>/<pdf_id>/<1>.png
def convert_and_save_pdf_to_png(pdf_file, category, population_storage_path, pdf_obj):
	pdf_storage_dir = os.path.join(
		population_storage_path,
		'pdf'
	)
	category_dir = os.path.join(pdf_storage_dir, category)
	save_dir = os.path.join(category_dir, str(pdf_obj.id))

	dir_exists = create_dir_if_not_exists(save_dir)
	pdf_saved_filepath = save_pdf_file(pdf_file, save_dir)

	images_from_pdf = convert_from_path(pdf_saved_filepath, IMG_QUALITY_IN_DPI)
	save_inverted_image(images_from_pdf, save_dir)

	return pdf_saved_filepath
