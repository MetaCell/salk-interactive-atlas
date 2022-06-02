import os.path
import uuid

from cordmap.main import register_sections_3D

from api.services.filesystem_service import move_file
from api.utils import get_persistence_path

OUTPUT_DIRECTORY = './out'
CELLS_CSV = 'transformed_cells'


def get_cells_filepath(data_filepath, storage_path):
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    register_sections_3D(data_filepath, out_dir)
    filepath = move_file(os.path.join(out_dir, f"{CELLS_CSV}.csv"), storage_path,
                         f"{CELLS_CSV}_{str(uuid.uuid4())[:8]}.csv")
    return filepath
