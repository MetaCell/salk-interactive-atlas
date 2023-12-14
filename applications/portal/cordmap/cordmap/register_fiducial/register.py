import logging
import math

import numpy as np

from cordmap.data.utils import cumulative_cord_length
from cordmap.register_fiducial.io import (
    PolygonGenerationError,
    get_as_image,
    get_atlas_slice_fiducial_raw,
    load_df_preprocessed,
    register_fiducial,
)
from cordmap.register.elastix import transform_multiple_point_sets


def remove_atlas_padding(points, atlas_pad_x, atlas_pad_y, image_padding):
    """

    :param points:
    :param atlas_pad_x:
    :param atlas_pad_y:
    :param image_padding:
    :return:
    """
    atlas_x = points[:, 0] + atlas_pad_x - image_padding
    atlas_y = points[:, 1] + atlas_pad_y - image_padding
    return atlas_x, atlas_y


def get_atlas_z_position(z_position_sample, segment_length=1000):
    """
    Z positions of Sofia's data are defined arbitrarily as Z = 0 is the
    end of C8 with positive Z values indicating distance from C8
    (towards C1). Each segment is assumed to be 1mm in length.
    Negative values indicate distance from C8 towards T1 etc.

    :param z_position_sample: the position of the slice in sample space
    :param segment_length: the estimated length of each cervical segment.
    :return:
    """

    segment_labels_dict = {
        1: "C1",
        2: "C2",
        3: "C3",
        4: "C4",
        5: "C5",
        6: "C6",
        7: "C7",
        8: "C8",
        9: "T1",
    }

    segment_id = math.floor(z_position_sample / segment_length)
    segment = segment_labels_dict[8 - segment_id]

    segment_start = cumulative_cord_length(segment, include_this_segment=True)
    segment_end = cumulative_cord_length(segment, include_this_segment=False)

    logging.info(f"start: {segment_start}, end: {segment_end}")

    percent_through_segment = (
        z_position_sample % segment_length
    ) / segment_length
    atlas_pos = (
        segment_start - (segment_start - segment_end) * percent_through_segment
    )

    logging.info(
        f"Registering sample Z position {z_position_sample} "
        f"to atlas Z position {int(atlas_pos)}"
    )
    return int(atlas_pos)


def get_scaling_factor(markers_sample, markers_atlas):
    x_scale = markers_atlas["x"].max() / markers_sample["x"].max()
    y_scale = markers_atlas["y"].max() / markers_sample["y"].max()
    return np.mean([x_scale, y_scale])


def register_fiducial_single_section(
    atlas,
    sample,
    z_position_sample=30,
    image_padding=10,
    T1_border=-1000,
    C1_border=8000,
):
    """
    Registers a single sample section to the atlas.

    :param atlas:
    :param sample:
    :param z_position_sample:
    :param image_padding:
    :return:
    """
    if z_position_sample < T1_border:  # atlas does not go beyond T1
        return None

    elif z_position_sample > C1_border:  # atlas does not go beyond C1
        return None

    try:
        z_position_atlas = get_atlas_z_position(z_position_sample)
        logging.info(f"z position atlas: {z_position_atlas}")
        markers_sample, cells, cells_labels = load_df_preprocessed(
            sample,
            z_position_sample,
            normalise=True,
            # scale_factor=20,
        )
        markers_atlas = get_atlas_slice_fiducial_raw(z_position_atlas, atlas)

        scale_factor = get_scaling_factor(markers_sample, markers_atlas)

        for item in [markers_sample, cells]:
            item["x"] *= scale_factor
            item["y"] *= scale_factor

        fixed_image = get_as_image(
            markers_sample, padding=image_padding
        ).astype(np.float32)

        sample_points = np.array(markers_sample[["x", "y"]])
        sample_points += image_padding

        atlas_pad_x = markers_atlas["x"].min()
        atlas_pad_y = markers_atlas["y"].min()

        markers_atlas["x"] -= atlas_pad_x
        markers_atlas["y"] -= atlas_pad_y

        moving_image = get_as_image(
            markers_atlas, padding=image_padding
        ).astype(np.float32)

        moving_points = np.array(markers_atlas[["x", "y"]])
        moving_points += image_padding

        cells_points = np.array(cells[["x", "y"]])
        cells_points += image_padding

        transformed_image, result_transform_parameters = register_fiducial(
            fixed_image,
            moving_image,
            sample_points,
            moving_points,
            affine=True,
            rigid=True,
            bspline=True,
            use_control_points=True,
            image_metric_weight=0.1,
            point_metric_weight=0.9,
        )

        (
            transformed_sample_points,
            transformed_cells,
        ) = transform_multiple_point_sets(
            sample_points,
            cells_points,
            moving_image=moving_image,
            result_transform_parameters=result_transform_parameters,
            log=True,
            debug=False,
        )

        transformed_cells_x, transformed_cells_y = remove_atlas_padding(
            transformed_cells, atlas_pad_x, atlas_pad_y, image_padding
        )

        transformed_cells = []

        for x, y in zip(transformed_cells_x, transformed_cells_y):
            transformed_cells.append([x, y])

    except PolygonGenerationError as e:
        print(e)
        return None

    return z_position_atlas, transformed_cells, cells_labels
