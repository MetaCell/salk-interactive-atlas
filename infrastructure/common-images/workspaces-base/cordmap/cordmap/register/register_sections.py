import numpy as np

import logging
import ray

from fancylog import fancylog

from cordmap.data.utils import (
    get_segment_from_z_position,
    interpolate_atlas_section,
)

from cordmap.atlas.utils import atlas_section_from_segment

from cordmap.utils.data_processing import get_single_data_section
from cordmap.register.elastix import register, transform_multiple_point_sets
from cordmap.utils.misc import (
    add_2D_points_to_3D_array,
    add_z_dim_to_2D_points,
)


def register_single_section(
    data_z_coordinate,
    moving_image,
    segment_z_values,
    atlas_segments,
    data_by_type,
    atlas_pixel_size,
    max_y,
    atlas_centroids,
    cell_type_name: str = "OpenUpTriangle",
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
    logging.info(f"Registering section: {data_z_coordinate}")
    print(f"Registering section: {data_z_coordinate}")

    atlas_segment = get_segment_from_z_position(
        data_z_coordinate, segment_z_values
    )
    if atlas_segment is None:
        logging.warning(
            f"Plane: {data_z_coordinate} does not appear in "
            f"this atlas. This data will not be registered."
        )
        return None

    atlas_section = atlas_section_from_segment(atlas_segment, atlas_segments)

    (
        cells_slice,
        gm_slice,
        cord_slice,
        fixed_image,
        central_canal_coord_data,
    ) = get_single_data_section(
        data_by_type,
        data_z_coordinate,
        max_y,
        atlas_pixel_size=atlas_pixel_size,
        cell_type_name=cell_type_name,
        cord_exterior_type_name=cord_exterior_type_name,
        grey_matter_type_name=grey_matter_type_name,
        padding=padding,
        subsample=subsample,
        use_cord_for_reg=use_cord_for_reg,
        use_gm_for_reg=use_gm_for_reg,
    )

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

    atlas_section = interpolate_atlas_section(
        atlas_section,
        data_z_coordinate,
        segment_z_values,
        atlas_segment,
        atlas_segments,
    )

    return (
        atlas_section,
        transformed_cells_section,
        transformed_gm_section,
        transformed_cord_section,
    )


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
    cell_type_name,
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
            cell_type_name=cell_type_name,
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
            ) = output

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

    return [
        data_z_coordinates,
        transformed_cells_sections,
        transformed_gm_sections,
        transformed_cord_sections,
    ]


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
    cell_type_name: str = "OpenUpTriangle",
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
        cell_type_name=cell_type_name,
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
        ) = output

        transformed_cells = add_2D_points_to_3D_array(
            transformed_cells_section, atlas_section, transformed_cells
        )
        transformed_gm = add_2D_points_to_3D_array(
            transformed_gm_section, atlas_section, transformed_gm
        )
        transformed_cord = add_2D_points_to_3D_array(
            transformed_cord_section, atlas_section, transformed_cord
        )
    return transformed_cells, transformed_gm, transformed_cord
