import os.path
import uuid

from api.services.filesystem_service import move_file

OUTPUT_DIRECTORY = "./out"
CELLS_CSV = "cells_with_labels"


def get_cells_filepath(population_name: str, data_filepath: str, storage_path: str, is_fiducial: bool = False):
    if is_fiducial:
        return _get_cells_filepath_from_single_file(population_name, data_filepath, storage_path)
    else:
        return _get_cells_filepath_from_file_pair(population_name, data_filepath, storage_path)


def _get_cells_filepath_from_file_pair(population_name: str, data_filepath: str, storage_path: str):
    from cordmap.main import register_sections_3D
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    register_sections_3D(data_filepath, out_dir, parallel=False)
    filepath = move_file(
        os.path.join(out_dir, f"{CELLS_CSV}_{population_name}.csv"),
        storage_path,
        f"{CELLS_CSV}_{str(uuid.uuid4())[:8]}.csv",
    )
    return filepath


def _get_cells_filepath_from_single_file(population_name: str, filepath: str, storage_path: str):
    from cordmap.entry_points.register_3D_fiducial import register_3D_fiducial
    out_dir = os.path.join(os.path.dirname(filepath), OUTPUT_DIRECTORY)
    register_3D_fiducial(filepath, out_dir)
    filepath = move_file(
        os.path.join(out_dir, f"{CELLS_CSV}_{population_name}.csv"),
        storage_path,
        f"{CELLS_CSV}_{str(uuid.uuid4())[:8]}.csv",
    )
    return filepath
