import os.path
import uuid
from pathlib import Path
from cordmap.main import register_sections_3D
from django.conf import settings
from django.core.files import File
from api.helpers.filesystem import move_file

OUTPUT_DIRECTORY = './out'
CELLS_CSV = 'transformed_cells'


def get_cells_filepath(data_filepath, storage_path):
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    register_sections_3D(data_filepath, out_dir)
    filepath = move_file(os.path.join(out_dir, f"{CELLS_CSV}.csv"), storage_path,
                         f"{CELLS_CSV}_{str(uuid.uuid4())[:8]}.csv")
    return filepath.split(settings.PERSISTENT_ROOT+'/')[1]
