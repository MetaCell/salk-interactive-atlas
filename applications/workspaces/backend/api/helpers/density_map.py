import numpy as np
import csv
from PIL import Image
from bg_atlasapi import BrainGlobeAtlas
from api.models import Population
from cordmap.postprocessing.prob_map import generate_prob_map

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


def _set_min_depth_cells(cells):
    cells_list = []
    min_depth = min([cell[0] for cell in cells])
    for cell in cells:
        cells_list.append([min_depth, cell[1], cell[2]])
    return np.array(cells_list)


def _get_valid_range(bg_atlas, subdivision):
    subdivision_id, subpart = subdivision.split('-')
    segment = next((x for x in bg_atlas.metadata['atlas_segments'] if x['Segment'] == subdivision_id), None)
    if not segment:
        return 0, 0
    mid = (segment['End'] + segment['Start']) / 2
    if subpart == ROSTRAL:
        return segment['Start'], mid
    if subpart == CAUDAL:
        return mid, segment['End']
    return 0, 0


def get_cells(bg_atlas, subdivision, populations_ids):
    cells = []
    valid_range = _get_valid_range(bg_atlas, subdivision)
    populations = Population.objects.filter(pk__in=populations_ids)
    for pop in populations:
        with open(pop.cells.path) as cells_file:
            reader = csv.reader(cells_file)
            for row in reader:
                depth = float(row[0])
                if valid_range[0] <= depth < valid_range[1]:
                    cells.append([float(c) for c in row])
    return _set_min_depth_cells(cells)


def generate_density_map(atlas, subdivision, populations):
    bg_atlas = BrainGlobeAtlas(atlas, check_latest=False)
    populations_ids = [int(i) for i in populations.split(',')]
    cells = get_cells(bg_atlas, subdivision, populations_ids)
    depth = int(cells[0][0])
    save_prob_map = False
    output_directory = 'N/A'
    mask_prob_map = True
    prob_map_smoothing = 100
    prob_map_normalise = True
    probability_map = generate_prob_map(
        output_directory,
        cells,
        bg_atlas,
        save_prob_map,
        mask=mask_prob_map,
        smoothing=prob_map_smoothing,
        normalise=prob_map_normalise,
    )
    img = probability_map[depth]
    scaled_image = 256 / np.max(img) * img
    density_img = Image.fromarray(scaled_image)
    density_img = density_img.convert('RGB')
    return density_img
