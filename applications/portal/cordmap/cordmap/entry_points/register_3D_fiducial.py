import logging
import random
from datetime import datetime

import fire
import numpy as np
import pandas as pd
from fancylog import fancylog

import cordmap as program_for_log
from cordmap.register_fiducial.bgatlasapi_wrapper import SalkAtlas
from cordmap.register_fiducial.io import save_output
from cordmap.register_fiducial.register_fiducials import (
    register_single_section_fiducial_serial,
)
from cordmap.utils.misc import ensure_directory_exists


def register_3D_fiducial(
    csv_file: str,
    output_directory: str,
    debug: bool = False,
    debug_slice_number: int = 5,
    save: bool = True,
    save_csv: bool = True,
    image_padding: int = 10,
    atlas_name: str = "salk_cord_10um",
):
    atlas = SalkAtlas(atlas_name)
    _ = datetime.now()
    ensure_directory_exists(output_directory)

    _ = fancylog.start_logging(
        output_directory,
        program_for_log,
        verbose=debug,
        log_header="CORDMAP LOG",
        multiprocessing_aware=True,
    )

    labeled_cells = pd.DataFrame(columns=["z", "x", "y", "population_key"])
    transformed_cells = np.empty((0, 3))

    sample = pd.read_csv(csv_file)
    cell_z_coordinates = sample["z"].unique()
    cell_type_names = sample["point"].unique()

    if debug:
        logging.debug("Analysing data subset")
        cell_z_coordinates = random.sample(
            cell_z_coordinates, debug_slice_number
        )

    for data_z_coordinate in cell_z_coordinates:
        logging.info(f"registering: {data_z_coordinate}")

        (
            transformed_cells,
            labeled_cells,
        ) = register_single_section_fiducial_serial(
            atlas,
            sample,
            data_z_coordinate,
            transformed_cells,
            labeled_cells,
            cell_type_names,
            image_padding=image_padding,
        )

    if save:
        labeled_cells = labeled_cells.rename(columns={"x": "y", "y": "x"})  # swap x and y
        save_output(
                output_directory,
                labeled_cells,
                transformed_cells,
                save_csv=save_csv,
            )


def main():
    fire.Fire(register_3D_fiducial)


if __name__ == "__main__":
    main()
