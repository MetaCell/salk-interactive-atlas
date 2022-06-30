import numpy as np
from PIL import Image

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.image_manipulation import get_image_from_array, black_to_transparent


def generate_annotation_image(bg_atlas: ICustomAtlas, subdivision: str) -> Image:
    return _generate_image(bg_atlas, subdivision, bg_atlas.get_annotation(['WM', 'GM']))


def generate_canal_image(bg_atlas: ICustomAtlas, subdivision: str) -> Image:
    return _generate_image(bg_atlas, subdivision, bg_atlas.canal)


def generate_lamina_image(bg_atlas: ICustomAtlas, subdivision: str, lamina_acronym) -> Image:
    return _generate_image(bg_atlas, subdivision, bg_atlas.get_image_volume(lamina_acronym))


def get_annotation_array(bg_atlas: ICustomAtlas, subdivision: str):
    return _get_img_array(bg_atlas, subdivision, bg_atlas.get_annotation(['WM', 'GM']))


def _generate_image(bg_atlas: ICustomAtlas, subdivision: str, image_data) -> Image:
    scaled_img_array = _get_img_array(bg_atlas, subdivision, image_data)
    img = get_image_from_array(scaled_img_array, 'RGB')
    return black_to_transparent(img)


def _get_img_array(bg_atlas, subdivision, image_data):
    segment_start, segment_end, position_within_segment = get_subdivision_limits(bg_atlas, subdivision)
    image_idx = int((segment_end - segment_start) * position_within_segment + segment_start)
    img_array = image_data[image_idx]
    scaled_img_array = 128 / np.max(img_array) * img_array
    return scaled_img_array
