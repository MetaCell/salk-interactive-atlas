import bisect
import csv
import os.path
from pathlib import Path

from django.conf import settings
from bg_atlasapi import BrainGlobeAtlas
from api.constants import ROSTRAL, CAUDAL
from api.helpers.filesystem import remove_dir, remove_file


def split_cells_per_segment(atlas_id, population_id, file):
    bg_atlas = BrainGlobeAtlas(atlas_id, check_latest=False)
    breakpoints, regions = _get_region_boundaries(bg_atlas.metadata['atlas_segments'])
    get_cell_segment = lambda depth: _boundaries(breakpoints, regions, depth)
    cells_file_dict = {r: [] for r in regions}
    with open(file.path) as cells_file:
        reader = csv.reader(cells_file)
        for row in reader:
            cell_depth = float(row[0])
            region = get_cell_segment(cell_depth)
            cells_file_dict[region] += [row]

    _create_cells_files(cells_file_dict, population_id)


def _create_cells_files(data, population_id):
    save_dir_path = get_population_save_dir(population_id)
    Path(save_dir_path).mkdir(parents=True, exist_ok=True)

    for r in data:
        csv_path = get_population_region_file_path(population_id, r)
        with open(csv_path, 'w') as f:
            writer = csv.writer(f)
            for cell in data[r]:
                writer.writerow(cell)


def _get_region_boundaries(segments_metadata):
    breakpoints, region = [], []
    segments_metadata.sort(key=lambda s: s['End'])
    for seg in segments_metadata:
        breakpoints.append(seg['End'] / 2)
        breakpoints.append(seg['End'])
        region.append(f"{seg['Segment']}-{ROSTRAL}")
        region.append(f"{seg['Segment']}-{CAUDAL}")
    return breakpoints, region


def _boundaries(breakpoints, regions, depth):
    i = bisect.bisect(breakpoints, depth - 1)
    return regions[i]


def get_population_region_file_path(population_id, region):
    save_dir_path = get_population_save_dir(population_id)
    return os.path.join(save_dir_path, region + ".csv")


def get_population_save_dir(population_id):
    return os.path.join(settings.PERSISTENT_ROOT, "populations", str(population_id))


def clear_storage(population_id, cells_file):
    save_dir_path = get_population_save_dir(population_id)
    remove_dir(save_dir_path)
    remove_file(cells_file.path)
