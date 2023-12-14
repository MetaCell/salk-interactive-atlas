import logging
import pathlib
import random
from datetime import datetime
from pathlib import Path

import numpy as np
import pandas as pd
import psutil
import ray
from bg_atlasapi import BrainGlobeAtlas
from fancylog import fancylog

import cordmap as program_for_log
from cordmap.atlas.utils import load_create_cord_gm_atlas_volume_image
from cordmap.data.io import load_data, save_output
from cordmap.data.utils import filter_data_by_type, get_data_segments
from cordmap.get_all_population_keys import get_populations_from_file
from cordmap.napari.vis import visualise_results
from cordmap.postprocessing.prob_map import generate_prob_map
from cordmap.register.constants import population_ignore_set
from cordmap.register.register_sections import (
    register_single_section_ray,
    register_single_section_serial,
)
from cordmap.utils.misc import ensure_directory_exists
from cordmap.utils.upsample_cells import upsample_population


def register_sections_3D(
    filename,
    output_directory,
    atlas_name="salk_cord_10um",
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    padding=10,
    debug=False,
    debug_slice_number=5,
    visualise=False,
    save=True,
    save_csv=True,
    save_npy=True,
    n_free_cpus=2,
    parallel=True,
    atlas_limit=None,
    subsample_points=0,
    use_control_points=False,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
    use_cord_for_reg=True,
    use_gm_for_reg=True,
    prob_map=False,
    save_prob_map=True,
    mask_prob_map=True,
    prob_map_normalise=True,
    prob_map_smoothing=100,
    population_upsampling_factor=1,
):
    start_time = datetime.now()
    ensure_directory_exists(output_directory)

    log_file = fancylog.start_logging(
        output_directory,
        program_for_log,
        verbose=debug,
        log_header="CORDMAP LOG",
        multiprocessing_aware=True,
    )
    cell_type_names = get_populations_from_file(
        pathlib.Path(filename), population_ignore_set
    )
    atlas = BrainGlobeAtlas(atlas_name)
    atlas.annotation[atlas.annotation > 2] = 2

    atlas_pixel_size_xy = int(atlas.resolution[1])

    atlas_segments = pd.DataFrame.from_dict(atlas.metadata["atlas_segments"])
    (
        annotation,
        moving_image,
        atlas_centroids,
    ) = load_create_cord_gm_atlas_volume_image(
        atlas,
        use_cord_for_reg=use_cord_for_reg,
        use_gm_for_reg=use_gm_for_reg,
        return_points=use_control_points,
    )

    if atlas_limit is not None:
        annotation = annotation[:atlas_limit]
        moving_image = moving_image[:atlas_limit]

    csv_file = Path(filename)
    data, metadata, max_y = load_data(csv_file)

    data_by_type = filter_data_by_type(data, metadata)

    segment_z_values = get_data_segments(data_by_type, atlas_segments)

    transformed_cells = np.empty((0, 3))  # deprecate
    labeled_cells = pd.DataFrame(columns=["z", "x", "y", "population_key"])
    transformed_gm = np.empty((0, 3))
    transformed_cord = np.empty((0, 3))
    z_export_data = pd.DataFrame(
        columns=["sample_z", "atlas_z", "segment_key"]
    )
    registration_errors_export_data = pd.DataFrame(
        columns=[
            "sample_z",
            "atlas_section_id",
            "npix percentage cord outlier",
            "npix percentage gm outlier",
            "percent gm",
            "percent wm",
        ]
    )
    cell_z_coordinates = []
    for cell_type_name in cell_type_names:
        cell_z_coordinates.extend(data_by_type[cell_type_name][:, 0])
    cell_z_coordinates = list(np.unique(cell_z_coordinates))

    if debug:
        logging.debug("Analysing data subset")
        cell_z_coordinates = random.sample(
            cell_z_coordinates, debug_slice_number
        )

    if parallel:
        num_processes = psutil.cpu_count() - n_free_cpus

        # split up the z positions into blocks for each process
        z_position_batches = np.array_split(cell_z_coordinates, num_processes)

        ray.init(num_cpus=num_processes)

        image_id = ray.put(moving_image)
        data = ray.put(data_by_type)

        output = ray.get(
            [
                register_single_section_ray.remote(
                    image_id,
                    data,
                    z_position_batches[i],
                    segment_z_values,
                    atlas_segments,
                    atlas_pixel_size_xy,
                    max_y,
                    atlas_centroids,
                    cell_type_names,
                    z_export_data,
                    registration_errors_export_data,
                    labeled_cells,
                    cord_exterior_type_name,
                    grey_matter_type_name,
                    padding,
                    debug,
                    subsample_points,
                    use_control_points,
                    image_metric_weight,
                    point_metric_weight,
                    use_cord_for_reg,
                    use_gm_for_reg,
                    log_file,
                )
                for i in range(num_processes)
            ]
        )

        for process in output:
            for z_position in process[1]:
                transformed_cells = np.append(
                    transformed_cells, z_position, axis=0
                )
            for z_position in process[2]:
                transformed_gm = np.append(transformed_gm, z_position, axis=0)
            for z_position in process[3]:
                transformed_cord = np.append(
                    transformed_cord, z_position, axis=0
                )
            z_export_data = z_export_data.append(process[4], ignore_index=True)
            registration_errors_export_data = (
                registration_errors_export_data.append(
                    process[5], ignore_index=True
                )
            )
            labeled_cells = labeled_cells.append(process[6], ignore_index=True)
    else:
        for data_z_coordinate in cell_z_coordinates:
            (
                transformed_cells,
                transformed_gm,
                transformed_cord,
                z_export_data,
                registration_errors_export_data,
                labeled_cells,
            ) = register_single_section_serial(
                data_z_coordinate,
                moving_image,
                segment_z_values,
                atlas_segments,
                transformed_cells,
                transformed_gm,
                transformed_cord,
                data_by_type,
                atlas_pixel_size_xy,
                max_y,
                atlas_centroids,
                z_export_data,
                registration_errors_export_data,
                labeled_cells,
                cell_type_names=cell_type_names,
                cord_exterior_type_name=cord_exterior_type_name,
                grey_matter_type_name=grey_matter_type_name,
                padding=padding,
                debug=debug,
                subsample=subsample_points,
                use_control_points=use_control_points,
                image_metric_weight=image_metric_weight,
                point_metric_weight=point_metric_weight,
                use_cord_for_reg=use_cord_for_reg,
                use_gm_for_reg=use_gm_for_reg,
            )

    if save:
        save_output(
            output_directory,
            transformed_cells,
            transformed_gm,
            transformed_cord,
            atlas,
            z_export_data,
            registration_errors_export_data,
            labeled_cells,
            save_csv=save_csv,
            save_npy=save_npy,
        )

    if population_upsampling_factor > 1:
        for k in labeled_cells["population_key"].unique():
            popdf = labeled_cells[labeled_cells["population_key"] == k]
            upsample_population(
                output_directory, popdf, k, None, population_upsampling_factor
            )

    if prob_map:
        probability_map = generate_prob_map(
            output_directory,
            transformed_cells,
            atlas,
            save_prob_map,
            mask=mask_prob_map,
            smoothing=prob_map_smoothing,
            normalise=prob_map_normalise,
        )
    else:
        probability_map = None

    logging.info(
        "Finished. Total time taken: {}".format(datetime.now() - start_time)
    )

    if visualise:
        visualise_results(
            annotation,
            transformed_cells,
            transformed_gm,
            transformed_cord,
            probability_map,
        )
