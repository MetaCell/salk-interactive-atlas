import logging

import numpy as np
from scipy.ndimage import zoom

from cordmap.data.utils import create_single_section
from cordmap.utils.misc import (
    create_image_from_polygon,
    image_size_from_points_2d,
)


def get_single_data_section(
    data_by_type,
    section_to_load,
    max_y,
    atlas_pixel_size=10,
    cell_type_name: str = "OpenUpTriangle",
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    padding=10,
    subsample=0,
    use_cord_for_reg=True,
    use_gm_for_reg=True,
    image_size=None,
):
    cells_slice, cord_slice, gm_slice, centroid = create_single_section(
        data_by_type,
        section_to_load,
        max_y,
        cell_type_name=cell_type_name,
        cord_exterior_type_name=cord_exterior_type_name,
        grey_matter_type_name=grey_matter_type_name,
        initial_pad=padding,
    )
    cord_gm_data_slice_image = create_cord_gm_image(
        cord_slice,
        gm_slice,
        subsample=subsample,
        padding=0,
        cord=use_cord_for_reg,
        gm=use_gm_for_reg,
        image_size=image_size,
    )
    cord_gm_data_slice_image = downscale_image(
        cord_gm_data_slice_image, scale_factor=atlas_pixel_size
    ).astype(np.float32)

    cells_slice, gm_slice, cord_slice = downscale_points(
        cells_slice, gm_slice, cord_slice, scale_factor=atlas_pixel_size
    )

    centroid = (centroid / subsample).astype(int)
    return (
        cells_slice,
        gm_slice,
        cord_slice,
        cord_gm_data_slice_image,
        centroid,
    )


def create_cord_gm_image(
    cord_points,
    gm_points,
    padding=10,
    subsample=0,
    cord=True,
    gm=True,
    image_size=None,
):
    if not cord and not gm:
        logging.warning(
            "Cord and grey matter are both deselected, using both anyway"
        )
        cord = True
        gm = True

    if image_size is None:
        image_size = image_size_from_points_2d(cord_points, padding=padding)

    if cord:
        sc_image = create_image_from_polygon(
            cord_points, image_size=image_size, subsample=subsample
        ).astype(np.float32)
        if not gm:
            return sc_image

    if gm:
        gm_image = create_image_from_polygon(
            gm_points, image_size=image_size, subsample=subsample
        ).astype(np.float32)
        if not cord:
            return gm_image

    return sc_image + gm_image


def downscale_points(*input_points, scale_factor=1):
    """
    Downscale points (e.g. numpy array) by a `scale_factor`
    :param input_points: Numpy array like objects, representing sets of points
    :param scale_factor: Downscaling factor
    :return: If one array is passed, one is returned.
    If >1 a tuple of arrays is returned.
    """

    if scale_factor == 0:
        raise ValueError("Scale factor cannot be 0")
    if len(input_points) == 0:
        raise ValueError(
            "At least one set of points to be scaled must be supplied"
        )
    elif len(input_points) == 1:
        if scale_factor == 1:
            return input_points[0]
        else:
            return input_points[0] // scale_factor
    else:
        if scale_factor == 1:
            return input_points
        else:
            return tuple(points // scale_factor for points in input_points)


def downscale_image(image, scale_factor=1):
    """
    Downscale image (e.g. numpy array) by a `scale_factor`
    :param image: Numpy array like object
    :param scale_factor: Downscaling factor
    :return: Downscaled image
    """
    if scale_factor == 1:
        return image
    else:
        return zoom(
            image,
            (1 / scale_factor, 1 / scale_factor),
            order=0,
            prefilter=False,
        )
