import os.path
import uuid

from api.services.filesystem_service import move_file

OUTPUT_DIRECTORY = "./out"
PAIR_CELLS_CSV_SUFFIXE = "cells_with_labels"
SINGLE_CELLS_CSV_SUFFIXE = "transformed_cells"


def get_cells_filepath(population_name: str, data_filepath: str, storage_path: str, is_fiducial: bool = False):
    if is_fiducial:
        from cordmap.entry_points.register_3D_fiducial import register_3D_fiducial
        register_func = lambda out_dir: register_3D_fiducial(data_filepath, out_dir)
        csv_suffix = SINGLE_CELLS_CSV_SUFFIXE
    else:
        from cordmap.main import register_sections_3D
        register_func = lambda out_dir: register_sections_3D(data_filepath, out_dir, parallel=True)
        csv_suffix = PAIR_CELLS_CSV_SUFFIXE

    return _get_cells_filepath(population_name, data_filepath, storage_path, register_func, csv_suffix)


def _get_cells_filepath(population_name: str, data_filepath: str, storage_path: str, register_func, csv_suffix):
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    register_func(out_dir)

    filepath = move_file(
        os.path.join(out_dir, f"{csv_suffix}_{population_name}.csv"),
        storage_path,
        f"{csv_suffix}_{str(uuid.uuid4())[:8]}.csv",
    )
    return filepath
