import numpy as np
from PIL import Image

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.image_manipulation import get_image_from_array, black_to_transparent


def generate_annotation_image(bg_atlas: ICustomAtlas, subdivision: str) -> Image:
    scaled_annot_array = get_annotation_array(bg_atlas, subdivision)
    annot_img = get_image_from_array(scaled_annot_array, 'RGB')
    return black_to_transparent(annot_img)


def get_annotation_array(bg_atlas, subdivision):
    subdivision_limits = get_subdivision_limits(bg_atlas, subdivision)
    middle_point = int((subdivision_limits[0] + subdivision_limits[1]) / 2)
    annot_array = bg_atlas.get_annotation(['WM', 'GM'])[middle_point]
    # scale image to 'greyish' tons (max value matches with #808080 (128))
    scaled_annot_array = 128 / np.max(annot_array) * annot_array
    return scaled_annot_array
