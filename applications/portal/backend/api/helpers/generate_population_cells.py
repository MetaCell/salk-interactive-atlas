import os.path
import uuid


from api.services.filesystem_service import move_file

OUTPUT_DIRECTORY = "./out"
CELLS_CSV = "cells_with_labels"


def get_cells_filepath(population_name: str, data_filepath: str, storage_path: str):
    from cordmap.main import register_sections_3D
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    register_sections_3D(data_filepath, out_dir)
    filepath = move_file(
        os.path.join(out_dir, f"{CELLS_CSV}_{population_name}.csv"),
        storage_path,
        f"{CELLS_CSV}_{str(uuid.uuid4())[:8]}.csv",
    )
    return filepath
