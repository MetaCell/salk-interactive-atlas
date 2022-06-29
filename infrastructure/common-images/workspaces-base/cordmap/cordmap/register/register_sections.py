import math
import re

import numpy as np

import logging

import pandas as pd
import ray
import skimage.morphology
import skimage.measure

from fancylog import fancylog

from cordmap.data.utils import (
    get_segment_from_z_position,
    interpolate_atlas_section,
    slice_loading_error_detected,
    get_atlas_z_position_from_segment,
)

from cordmap.atlas.utils import atlas_section_from_segment
from cordmap.register.validation import registration_quality_good_enough

from cordmap.utils.data_processing import get_single_data_section
from cordmap.register.elastix import register, transform_multiple_point_sets
from cordmap.utils.misc import (
    add_2D_points_to_3D_array,
    add_z_dim_to_2D_points,
)


def register_single_section(
    z_sample_space,
    moving_image,
    segment_z_values,
    atlas_segments,
    data_by_type,
    atlas_pixel_size,
    max_y,
    atlas_centroids,
    cell_type_names: list,
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    padding=10,
    debug=False,
    subsample=0,
    use_control_points=False,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
    use_cord_for_reg=True,
    use_gm_for_reg=True,
    atlas_from_segment=False,
):
    logging.info(f"Registering section: {z_sample_space}")
    print(f"Registering section: {z_sample_space}")

    atlas_segment = get_segment_from_z_position(
        z_sample_space, segment_z_values
    )
    if atlas_segment is None:
        logging.warning(
            f"Plane: {z_sample_space} does not appear in "
            f"this atlas. This data will not be registered."
        )
        return None

    if (
        atlas_from_segment
    ):  # old atlas selects one slice per segment to register
        atlas_section = atlas_section_from_segment(
            atlas_segment, atlas_segments
        )

    else:  # new atlas has a slice for each z pos

        atlas_section = math.ceil(
            get_atlas_z_position_from_segment(z_sample_space, segment_z_values)
        )
        atlas_section = min(len(moving_image) - 1, atlas_section)

    output = get_single_data_section(
        data_by_type,
        z_sample_space,
        max_y,
        cell_type_names=cell_type_names,
        atlas_pixel_size=atlas_pixel_size,
        cord_exterior_type_name=cord_exterior_type_name,
        grey_matter_type_name=grey_matter_type_name,
        padding=padding,
        subsample=subsample,
        use_cord_for_reg=use_cord_for_reg,
        use_gm_for_reg=use_gm_for_reg,
    )
    if output is None:
        return None
    (
        cells_slice,
        gm_slice,
        cord_slice,
        fixed_image,
        central_canal_coord_data,
        cell_pop_labels,
    ) = output

    cells_slice, cord_slice, fixed_image, gm_slice = dilate_cord_image(
        cells_slice, fixed_image, padding=4
    )

    if slice_loading_error_detected(fixed_image):
        return None

    if use_control_points:
        fixed_points = np.array([central_canal_coord_data])
        moving_points = np.array([atlas_centroids[atlas_section]])
    else:
        fixed_points = None
        moving_points = None

    logging.info("Registering section")

    transformed_atlas, result_transform_parameters = register(
        fixed_image,
        moving_image[atlas_section],
        log=debug,
        use_control_points=use_control_points,
        image_metric_weight=image_metric_weight,
        point_metric_weight=point_metric_weight,
        fixed_points=fixed_points,
        moving_points=moving_points,
    )

    logging.info("Warping points from raw space to atlas space")
    (
        transformed_cells_section,
        transformed_gm_section,
        transformed_cord_section,
    ) = transform_multiple_point_sets(
        cells_slice,
        gm_slice,
        cord_slice,
        moving_image=fixed_image,
        result_transform_parameters=result_transform_parameters,
        log=debug,
        debug=debug,
    )
    if (
        atlas_from_segment
    ):  # old atlas needs to interpolate for position within segment
        atlas_section = interpolate_atlas_section(
            atlas_section,
            z_sample_space,
            segment_z_values,
            atlas_segment,
            atlas_segments,
        )

    return (
        atlas_section,
        transformed_cells_section,
        transformed_gm_section,
        transformed_cord_section,
        z_sample_space,
        cell_pop_labels,
    )


def dilate_cord_image(cells_slice, fixed_image, padding):
    cells_slice += padding
    fixed_image = np.pad(fixed_image, padding)
    dilated_cord_image = skimage.morphology.binary_dilation(
        fixed_image
    ).astype(np.float32)
    dilated_cord_image = skimage.morphology.binary_dilation(
        dilated_cord_image
    ).astype(np.float32)

    dilated_cord_image[fixed_image == 2] = 2
    fixed_image = dilated_cord_image
    cord_slice = skimage.measure.find_contours(fixed_image, 0)[0]
    gm_slice = skimage.measure.find_contours(fixed_image)[0]
    return cells_slice, cord_slice, fixed_image, gm_slice


def get_sample_image_length(data_by_type, segment_keys):
    sample_image_length = 0
    for segment_key in segment_keys:
        segment_data_z_coordinates = list(
            np.unique(data_by_type[segment_key][:, 0])
        )
        sample_image_length += len(segment_data_z_coordinates)
    return sample_image_length


def get_segment_keys(data_by_type):
    segment_keys = []
    for k in data_by_type.keys():
        k = k.strip()
        segment_key = re.fullmatch("[CT]\\d[LR]\\w+", k)
        if segment_key is None:
            segment_key = re.fullmatch("[CT][1-9]?", k)
        if segment_key is not None:
            segment_keys.append(k)
    return set(segment_keys)


@ray.remote
def register_single_section_ray(
    moving_image,
    data,
    data_z_coordinates,
    segment_z_values,
    atlas_segments,
    atlas_pixel_size,
    max_y,
    atlas_centroids,
    cell_type_names,
    z_export_data,
    registration_errors_export_data,
    labeled_cells: pd.DataFrame,
    cord_exterior_type_name,
    grey_matter_type_name,
    padding,
    debug,
    subsample,
    use_control_points,
    image_metric_weight,
    point_metric_weight,
    use_cord_for_reg,
    use_gm_for_reg,
    log_file,
):
    fancylog.initalise_logger(log_file)
    transformed_cells_sections = []
    transformed_gm_sections = []
    transformed_cord_sections = []
    for data_z_coordinate in data_z_coordinates:
        output = register_single_section(
            data_z_coordinate,
            moving_image,
            segment_z_values,
            atlas_segments,
            data,
            atlas_pixel_size,
            max_y,
            atlas_centroids,
            cell_type_names=cell_type_names,
            cord_exterior_type_name=cord_exterior_type_name,
            grey_matter_type_name=grey_matter_type_name,
            padding=padding,
            debug=debug,
            subsample=subsample,
            use_control_points=use_control_points,
            image_metric_weight=image_metric_weight,
            point_metric_weight=point_metric_weight,
            use_cord_for_reg=use_cord_for_reg,
            use_gm_for_reg=use_gm_for_reg,
        )

        # if data has a corresponding atlas section
        if output is not None:
            (
                atlas_section,
                transformed_cells_section,
                transformed_gm_section,
                transformed_cord_section,
                z_sample_space,
                cell_pop_labels,
            ) = output

            if registration_quality_good_enough(
                moving_image,
                atlas_section,
                transformed_cord_section,
                transformed_gm_section,
                z_sample_space,
                registration_errors_export_data,
            ):
                for all_data, section_data in zip(
                    (
                        transformed_cells_sections,
                        transformed_gm_sections,
                        transformed_cord_sections,
                    ),
                    (
                        transformed_cells_section,
                        transformed_gm_section,
                        transformed_cord_section,
                    ),
                ):
                    all_data.append(
                        add_z_dim_to_2D_points(section_data, atlas_section)
                    )
                z_export_data.loc[len(z_export_data)] = [
                    z_sample_space,
                    atlas_section,
                    get_atlas_segment(atlas_segments, atlas_section),
                ]

                labeled_cells = update_labeled_cells(
                    labeled_cells,
                    atlas_section,
                    transformed_cells_section,
                    cell_pop_labels,
                )

    return [
        data_z_coordinates,
        transformed_cells_sections,
        transformed_gm_sections,
        transformed_cord_sections,
        z_export_data,
        registration_errors_export_data,
        labeled_cells,
    ]


def get_atlas_segment(atlas_segments, atlas_section):
    return atlas_segments[
        (atlas_segments["Start"] <= atlas_section)
        & (atlas_segments["End"] >= atlas_section)
    ]["Segment"].values[0]


def update_labeled_cells(
    labeled_cells, atlas_section, transformed_cells_section, population_keys
):
    for cell, label in zip(transformed_cells_section, population_keys):

        labeled_cells.loc[len(labeled_cells)] = [
            atlas_section,
            cell[0],
            cell[1],
            label,
        ]
    return labeled_cells


def register_single_section_serial(
    data_z_coordinate,
    moving_image,
    segment_z_values,
    atlas_segments,
    transformed_cells,
    transformed_gm,
    transformed_cord,
    data_by_type,
    atlas_pixel_size,
    max_y,
    atlas_centroids,
    z_export_data: pd.DataFrame,
    registration_errors_export_data: pd.DataFrame,
    labeled_cells: pd.DataFrame,
    cell_type_names: list,
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    padding=10,
    debug=False,
    subsample=0,
    use_control_points=False,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
    use_cord_for_reg=True,
    use_gm_for_reg=True,
):
    output = register_single_section(
        data_z_coordinate,
        moving_image,
        segment_z_values,
        atlas_segments,
        data_by_type,
        atlas_pixel_size,
        max_y,
        atlas_centroids,
        cell_type_names=cell_type_names,
        cord_exterior_type_name=cord_exterior_type_name,
        grey_matter_type_name=grey_matter_type_name,
        padding=padding,
        debug=debug,
        subsample=subsample,
        use_control_points=use_control_points,
        image_metric_weight=image_metric_weight,
        point_metric_weight=point_metric_weight,
        use_cord_for_reg=use_cord_for_reg,
        use_gm_for_reg=use_gm_for_reg,
    )

    # if data has a corresponding atlas section
    if output is not None:

        (
            atlas_section,
            transformed_cells_section,
            transformed_gm_section,
            transformed_cord_section,
            z_sample_space,
            cell_pop_labels,
        ) = output

        if registration_quality_good_enough(
            moving_image,
            atlas_section,
            transformed_cord_section,
            transformed_gm_section,
            z_sample_space,
            registration_errors_export_data,
        ):

            transformed_cells = add_2D_points_to_3D_array(
                transformed_cells_section, atlas_section, transformed_cells
            )
            transformed_gm = add_2D_points_to_3D_array(
                transformed_gm_section, atlas_section, transformed_gm
            )
            transformed_cord = add_2D_points_to_3D_array(
                transformed_cord_section, atlas_section, transformed_cord
            )
            z_export_data.loc[len(z_export_data)] = [
                z_sample_space,
                atlas_section,
                get_atlas_segment(atlas_segments, atlas_section),
            ]
            labeled_cells = update_labeled_cells(
                labeled_cells,
                atlas_section,
                transformed_cells_section,
                cell_pop_labels,
            )

    return (
        transformed_cells,
        transformed_gm,
        transformed_cord,
        z_export_data,
        registration_errors_export_data,
        labeled_cells,
    )
