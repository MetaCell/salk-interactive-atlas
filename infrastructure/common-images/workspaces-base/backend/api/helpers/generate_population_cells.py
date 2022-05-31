import os.path
from pathlib import Path

from cordmap.main import register_sections_3D
from django.core.files import File

OUTPUT_DIRECTORY = './out'
CELLS_CSV = 'transformed_cells.csv'


def get_cells_file(key_filename):
    register_sections_3D(key_filename, OUTPUT_DIRECTORY)
    p = Path(os.path.join(OUTPUT_DIRECTORY, CELLS_CSV))
    with p.open(mode='rb') as f:
        return File(f, name=p.name)
