import numpy as np
from PIL import Image

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.image_manipulation import get_image_from_array, black_to_transparent


def generate_annotation_image(bg_atlas: ICustomAtlas, subdivision: str) -> (np.array, Image):
    return _generate_image(bg_atlas, subdivision, bg_atlas.get_annotation(['WM', 'GM']))


def generate_canal_image(bg_atlas: ICustomAtlas, subdivision: str) -> (np.array, Image):
    return _generate_image(bg_atlas, subdivision, bg_atlas.canal)


def generate_lamina_image(bg_atlas: ICustomAtlas, subdivision: str, lamina_acronym) -> (np.array, Image):
    return _generate_image(bg_atlas, subdivision, bg_atlas.get_image_volume(lamina_acronym))


def get_annotation_array(bg_atlas: ICustomAtlas, subdivision: str):
    return _get_img_array(bg_atlas, subdivision, bg_atlas.get_annotation(['WM', 'GM']))


def _generate_image(bg_atlas: ICustomAtlas, subdivision: str, image_data) -> (np.array, Image):
    scaled_img_array = _get_img_array(bg_atlas, subdivision, image_data)
    img = get_image_from_array(scaled_img_array, 'RGB')
    return scaled_img_array, black_to_transparent(img)


def _get_img_array(bg_atlas, subdivision, image_data):
    segment_start, segment_end, position_within_segment = get_subdivision_limits(bg_atlas, subdivision)
    image_idx = int((segment_end - segment_start) * position_within_segment + segment_start)
    img_array = image_data[image_idx]
    scaled_img_array = 128 / np.max(img_array) * img_array
    return scaled_img_array


def generate_image_contour(scaled_img_array: np.array, dashed=False) -> (np.array, Image):
    contour_img_array = scaled_img_array.copy()
    for row in range(0, len(scaled_img_array)):
        for col in range(0, len(scaled_img_array[row])):
            row_up = row - 1
            row_down = row + 1
            col_right = col + 1
            col_left = col - 1
            # if current value has color
            if scaled_img_array[row][col] > 0:
                # if it's not in the limits of the matrix
                if 0 < row < len(scaled_img_array) and 0 < col < len(scaled_img_array[row]):
                    # if is surrounded by values with color
                    if scaled_img_array[row_up][col] > 0 and scaled_img_array[row_down][col] > 0 and \
                            scaled_img_array[row][col_left] > 0 and scaled_img_array[row][col_right] > 0:
                        # it's not part of the contour
                        contour_img_array[row][col] = 0
            if dashed and contour_img_array[row][col] > 0:
                contour_img_array[row_up][col] = 0
                contour_img_array[row_up][col_right] = 0
                contour_img_array[row][col_right] = 0
                contour_img_array[row_down][col_right] = 0
                contour_img_array[row_down][col] = 0
                contour_img_array[row_down][col_left] = 0
                contour_img_array[row][col_left] = 0
                contour_img_array[row_up][col_left] = 0

    return contour_img_array, black_to_transparent(get_image_from_array(contour_img_array, 'RGB'))
