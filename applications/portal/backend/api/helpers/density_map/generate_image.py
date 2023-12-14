from typing import Tuple

import cachetools
import numpy as np
from PIL import Image

from api.constants import FULLY_OPAQUE, WHITE
from api.helpers.density_map.common_density_helpers import get_image_array_geometric_vs_centroid_offset
from api.helpers.density_map.grid_creator import get_grid_images
from api.helpers.exceptions import NoImageDataError
from api.helpers.icustom_atlas import ICustomAtlas
from api.helpers.image_manipulation import black_to_transparent, get_image_from_image_array
from api.services.atlas_upscale_service import get_upsampled_atlas_image_array, get_2d_mask
from workspaces.settings import (
    GREY_SCALE_MAX_ANNOTATION,
    GREY_SCALE_MAX_CANAL,
    GREY_SCALE_MAX_DEFAULT, POSITION_WITHIN_SUBDIVISION, CANAL_IMAGE_OPACITY, WHITE_MATTER_REGION_KEY,
    GREY_MATTER_REGION_KEY, CENTRAL_CANAL_REGION_KEY,
)


def generate_grey_and_white_matter_image(
        bg_atlas: ICustomAtlas, subdivision: str
) -> (np.array, Image):
    """
    Generate an annotation image for a specific subdivision of an atlas

    Args:
        bg_atlas (ICustomAtlas): the atlas to generate the image from
        subdivision (str): the subdivision of the atlas

    Returns:
        Tuple[np.array, Image]: the annotation image array and the annotation image
    """
    colored_img_array = get_grey_and_white_matter_image_array(bg_atlas, subdivision)
    shifted_img_array = shift_image_array(colored_img_array, get_canal_offset(bg_atlas, subdivision))
    img = get_image_from_image_array(shifted_img_array, "RGB")
    return colored_img_array, black_to_transparent(img, FULLY_OPAQUE)


def _get_best_grey_shade_for_wm_gm(bg_atlas: ICustomAtlas) -> float:
    """
    Get the shade of grey for the gray and white matter images according to the amount of laminas present in the atlas

    Args:
        bg_atlas (ICustomAtlas): the atlas to get the grey shade from

    Returns:
        float: the grey shade for the annotation image
    """

    laminas_len = len(
        list(filter(lambda k: "Sp" in k, bg_atlas.structures.acronym_to_id_map.keys()))
    )
    return (round(
        (WHITE - GREY_SCALE_MAX_ANNOTATION) * (1 / laminas_len * (laminas_len - 1))) + GREY_SCALE_MAX_ANNOTATION)


def get_grey_and_white_matter_image_array(bg_atlas: ICustomAtlas, subdivision: str):
    """
    Retrieve the grey and white matter array for a specific subdivision of an atlas.

    Args:
        bg_atlas (ICustomAtlas): The atlas to retrieve the annotation array from.
        subdivision (str): The subdivision of the atlas.

    Returns:
        numpy.ndarray: The annotation array for the specific subdivision of the atlas.
    """
    atlas_subdivision_upscaled_image_array = get_upsampled_atlas_image_array(bg_atlas, subdivision,
                                                                             POSITION_WITHIN_SUBDIVISION)

    grey_white_matter_subdivision_image_array = _get_upscaled_grey_white_matter_image_array(
        atlas_subdivision_upscaled_image_array, bg_atlas)

    colored_img_array = np.select(
        [
            grey_white_matter_subdivision_image_array == bg_atlas.get_structure_annotation_value(WHITE_MATTER_REGION_KEY),
            grey_white_matter_subdivision_image_array == bg_atlas.get_structure_annotation_value(GREY_MATTER_REGION_KEY)
        ],
        [
            np.uint32(GREY_SCALE_MAX_DEFAULT),
            np.uint32(_get_best_grey_shade_for_wm_gm(bg_atlas)),
        ],
        0,
    )
    return colored_img_array


def _get_upscaled_grey_white_matter_image_array(upscaled_image_array, bg_atlas):
    grey_white_matter_image = np.zeros_like(upscaled_image_array)
    for region_key in [GREY_MATTER_REGION_KEY, WHITE_MATTER_REGION_KEY]:
        region_id = bg_atlas.structures[region_key]["id"]
        region_value = bg_atlas.get_structure_annotation_value(region_key)

        # Set the values in the image for the main region
        grey_white_matter_image[upscaled_image_array == region_value] = region_value

        # Process each child
        for child in bg_atlas.hierarchy.children(region_id):
            child_value = child.identifier - 1

            # Set the values in the image for the child region to the parent region value
            grey_white_matter_image[upscaled_image_array == child_value] = region_value

    return grey_white_matter_image


def get_color_scaled_image_array(image_array, grey_scale_max: int = GREY_SCALE_MAX_DEFAULT):
    """
    Retrieve a color scaled image array for a specific subdivision of an atlas.

    Args:
        image_array (numpy.ndarray): The input image data to be color scaled.
        grey_scale_max (int, optional): The maximum grayscale value. Defaults to GREY_SCALE_MAX_DEFAULT.

    Returns:
        numpy.ndarray: The color scaled image array for the specific subdivision of the atlas.
    """
    max_value = np.max(image_array)
    if max_value == 0:
        raise NoImageDataError()
    return grey_scale_max / max_value * image_array


cache_canal_offsets = cachetools.LRUCache(maxsize=100)


def get_canal_offset(bg_atlas: ICustomAtlas, subdivision: str) -> Tuple[int, int]:
    """
    Get the canal offset for a specific subdivision of an atlas.

    Args:
        bg_atlas (ICustomAtlas): The atlas to get the canal offset from.
        subdivision (str): The subdivision of the atlas.

    Returns:
        Tuple[int, int]: The canal offset.
    """

    key = (bg_atlas.get_id(), subdivision)
    result = cache_canal_offsets.get(key)
    if result is not None:
        return result

    upscaled_atlas_image_array = get_upsampled_atlas_image_array(bg_atlas, subdivision, POSITION_WITHIN_SUBDIVISION)
    canal_subdivision_image_array = get_2d_mask(bg_atlas, [bg_atlas.structures[CENTRAL_CANAL_REGION_KEY]["id"]],
                                                upscaled_atlas_image_array)

    offset = get_image_array_geometric_vs_centroid_offset(canal_subdivision_image_array)
    cache_canal_offsets[key] = offset
    return offset


def get_pad_from_offset(offset: Tuple[int, int]) -> Tuple[int, int, int, int]:
    """
    Get the padding values from a given offset.

    Args:
        offset (Tuple[int, int]): The given offset.

    Returns:
        Tuple[int, int, int, int]: The padding values.
    """
    top, right, bottom, left = 0, 0, 0, 0
    if offset[0] < 0:
        left = offset[0] * -2
    elif offset[0] > 0:
        right = offset[0] * 2
    if offset[1] < 0:
        bottom = offset[1] * -2
    elif offset[1] > 0:
        top = offset[1] * 2
    return top, right, bottom, left


def shift_image_array(image_array: np.array, shift_vector: Tuple[int, int]) -> np.array:
    """
    We should shift the array data by {shift_vector} amount without roll over data to 'the other side'
    In order to achieve that we pad the original array with {shift_vector} amount
    If we want the center to move x units we need to add a pad of x * 2
    :param image_array:
    :param shift_vector:
    :return:
    """

    y_pad = (0, int(shift_vector[1] * -1 * 2)) if shift_vector[1] < 0 else (int(shift_vector[1] * 2), 0)
    x_pad = (int(shift_vector[0] * -1 * 2), 0) if shift_vector[0] < 0 else (0, int(shift_vector[0] * 2))
    return np.pad(image_array, pad_width=[y_pad, x_pad], mode='constant', constant_values=0)


def generate_image_contour(
        scaled_img_array: np.array, dashed=False
) -> (np.array, Image):
    """
    Generate an image contour.

    Args:
        scaled_img_array (np.array): The input image array.
        dashed (bool, optional): If set to True, the contour will be dashed. Defaults to False.

    Returns:
        Tuple[np.array, Image]: The contour image array and the contour image.
    """
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
        get_image_from_image_array(contour_img_array, "RGB")
    )


def generate_canal_image(bg_atlas: ICustomAtlas, subdivision: str) -> (np.array, Image):
    """
    Generate a canal image for a specific subdivision of an atlas.

    Args:
        bg_atlas (ICustomAtlas): The atlas to generate the image from.
        subdivision (str): The subdivision of the atlas.

    Returns:
        Tuple[np.array, Image]: The canal image array and the canal image.
    """

    atlas_subdivision_upscaled_image_array = get_upsampled_atlas_image_array(bg_atlas, subdivision,
                                                                             POSITION_WITHIN_SUBDIVISION)
    canal_subdivision_image_array = get_2d_mask(bg_atlas, [bg_atlas.structures[CENTRAL_CANAL_REGION_KEY]["id"]],
                                                atlas_subdivision_upscaled_image_array)
    shifted_img_array = shift_image_array(canal_subdivision_image_array, get_canal_offset(bg_atlas, subdivision))

    color_scaled_canal_subdivision_image_array = get_color_scaled_image_array(shifted_img_array,
                                                                              GREY_SCALE_MAX_CANAL)
    img = get_image_from_image_array(color_scaled_canal_subdivision_image_array, "RGB")
    return color_scaled_canal_subdivision_image_array, black_to_transparent(img, CANAL_IMAGE_OPACITY)


def generate_grid_images(bg_atlas: ICustomAtlas, subdivision: str) -> (Image, Image):
    """
    Generate grid images for a specific subdivision of an atlas.

    Args:
        bg_atlas (ICustomAtlas): The atlas to generate the images from.
        subdivision (str): The subdivision of the atlas.

    Returns:
        Tuple[Image, Image]: The generated grid images.
    """
    return get_grid_images(bg_atlas, subdivision)


def generate_lamina_image(
        bg_atlas: ICustomAtlas, subdivision: str, lamina_key
) -> (np.array, Image):
    """
    Generate a lamina image for a specific subdivision of an atlas.

    Args:
        bg_atlas (ICustomAtlas): The atlas to generate the image from.
        subdivision (str): The subdivision of the atlas.
        lamina_key (str): The id of the lamina.

    Returns:
        Tuple[np.array, Image]: The lamina image array and the lamina image.
    """

    atlas_subdivision_upscaled_image_array = get_upsampled_atlas_image_array(bg_atlas, subdivision,
                                                                             POSITION_WITHIN_SUBDIVISION)
    lamina_subdivision_image_array = get_2d_mask(bg_atlas, [bg_atlas.structures[lamina_key]["id"]],
                                                 atlas_subdivision_upscaled_image_array)
    shifted_image_array = shift_image_array(lamina_subdivision_image_array, get_canal_offset(bg_atlas, subdivision))
    color_scaled_lamina_subdivision_image_array = get_color_scaled_image_array(shifted_image_array,
                                                                               GREY_SCALE_MAX_CANAL)
    img = get_image_from_image_array(color_scaled_lamina_subdivision_image_array, "RGB")
    return color_scaled_lamina_subdivision_image_array, black_to_transparent(img, CANAL_IMAGE_OPACITY)
