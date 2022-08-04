import numpy as np
from PIL import Image

from api.constants import FULLY_OPAQUE, WHITE
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.density_map.grid_creator import get_grid_image
from api.helpers.exceptions import NoImageDataError
from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.image_manipulation import black_to_transparent, get_image_from_array
from workspaces.settings import (
    CANAL_IMAGE_OPACITY,
    DEFAULT_IMAGE_OPACITY,
    GREY_SCALE_MAX_ANNOTATION,
    GREY_SCALE_MAX_CANAL,
    GREY_SCALE_MAX_DEFAULT,
)


def generate_annotation_image(
    bg_atlas: ICustomAtlas, subdivision: str
) -> (np.array, Image):
    img_array = _get_img_array(
        bg_atlas, subdivision, bg_atlas.get_annotation(["WM", "GM"])
    )
    colored_img_array = np.select(
        [
            img_array == bg_atlas.structures["WM"]["id"] - 1,
            img_array == bg_atlas.structures["GM"]["id"] - 1,
        ],
        [
            np.uint32(GREY_SCALE_MAX_DEFAULT),
            np.uint32(_get_annotation_grey_shade(bg_atlas)),
        ],
        0,
    )
    img = get_image_from_array(colored_img_array, "RGB")
    return colored_img_array, black_to_transparent(img, FULLY_OPAQUE)


def _get_annotation_grey_shade(bg_atlas: ICustomAtlas) -> float:
    laminas_len = len(
        list(filter(lambda k: "Sp" in k, bg_atlas.structures.acronym_to_id_map.keys()))
    )
    return (
        round(
            (WHITE - GREY_SCALE_MAX_ANNOTATION) * (1 / laminas_len * (laminas_len - 1))
        )
        + GREY_SCALE_MAX_ANNOTATION
    )


def get_annotation_array(bg_atlas: ICustomAtlas, subdivision: str):
    return get_scaled_img_array(
        bg_atlas, subdivision, bg_atlas.get_annotation(["WM", "GM"])
    )


def _generate_image(
    bg_atlas: ICustomAtlas,
    subdivision: str,
    image_data,
    grey_scale_max: int = GREY_SCALE_MAX_DEFAULT,
    opacity: int = DEFAULT_IMAGE_OPACITY,
) -> (np.array, Image):
    scaled_img_array = get_scaled_img_array(
        bg_atlas, subdivision, image_data, grey_scale_max
    )
    img = get_image_from_array(scaled_img_array, "RGB")
    return scaled_img_array, black_to_transparent(img, opacity)


def _get_img_array(bg_atlas, subdivision, image_data):
    segment_start, segment_end, position_within_segment = get_subdivision_limits(
        bg_atlas, subdivision
    )
    image_idx = int(
        (segment_end - segment_start) * position_within_segment + segment_start
    )
    return image_data[image_idx]


def get_scaled_img_array(
    bg_atlas, subdivision, image_data, grey_scale_max: int = GREY_SCALE_MAX_DEFAULT
):
    img_array = _get_img_array(bg_atlas, subdivision, image_data)
    max_value = np.max(img_array)
    if max_value == 0:
        raise NoImageDataError()
    scaled_img_array = grey_scale_max / max_value * img_array
    return scaled_img_array


def generate_image_contour(
    scaled_img_array: np.array, dashed=False
) -> (np.array, Image):
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
                if 0 < row < len(scaled_img_array) and 0 < col < len(
                    scaled_img_array[row]
                ):
                    # if is surrounded by values with color
                    if (
                        scaled_img_array[row_up][col] > 0
                        and scaled_img_array[row_down][col] > 0
                        and scaled_img_array[row][col_left] > 0
                        and scaled_img_array[row][col_right] > 0
                    ):
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

    return contour_img_array, black_to_transparent(
        get_image_from_array(contour_img_array, "RGB")
    )


def generate_canal_image(bg_atlas: ICustomAtlas, subdivision: str) -> (np.array, Image):
    return _generate_image(
        bg_atlas, subdivision, bg_atlas.canal, GREY_SCALE_MAX_CANAL, CANAL_IMAGE_OPACITY
    )


def generate_grid_image(bg_atlas: ICustomAtlas, subdivision: str) -> (np.array, Image):
    canal_img_array = get_scaled_img_array(
        bg_atlas, subdivision, bg_atlas.canal, GREY_SCALE_MAX_CANAL
    )
    return get_grid_image(bg_atlas, subdivision, canal_img_array)


def generate_lamina_image(
    bg_atlas: ICustomAtlas, subdivision: str, lamina_acronym
) -> (np.array, Image):
    return _generate_image(
        bg_atlas, subdivision, bg_atlas.get_image_volume(lamina_acronym)
    )
