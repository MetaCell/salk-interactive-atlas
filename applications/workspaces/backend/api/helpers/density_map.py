import numpy as np
import csv
from PIL import Image
from bg_atlasapi import BrainGlobeAtlas

from api.helpers.atlas import get_bg_atlas
from api.models import Population
from api.services.population_service import get_cells
from cordmap.postprocessing.prob_map import generate_prob_map

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


def _set_min_depth_cells(cells):
    cells_list = []
    min_depth = int(min([cell[0] for cell in cells]))
    for cell in cells:
        cells_list.append([min_depth, cell[1], cell[2]])
    return min_depth, np.array(cells_list)


def generate_density_map(atlas, subdivision, populations_ids):
    bg_atlas = get_bg_atlas(atlas)
    min_depth, cells = _set_min_depth_cells(get_cells(subdivision, populations_ids))
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
    img = probability_map[min_depth]
    scaled_image = 256 / np.max(img) * img
    density_img = Image.fromarray(scaled_image)
    density_img = density_img.convert('RGB')
    return density_img
