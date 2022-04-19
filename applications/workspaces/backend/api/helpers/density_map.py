import numpy as np
from bg_atlasapi import BrainGlobeAtlas
from cordmap.postprocessing.prob_map import generate_prob_map
from PIL import Image

def _undepth_cells(cells):
    cells_list = []
    min_depth = min([cell['x'] for cell in cells])
    for cell in cells:
        cells_list.append([min_depth, cell['y'], cell['z']])
    return np.array(cells_list)


def generate_density_map(atlas, cells):
    if len(cells) == 0:
        return []

    depth = cells[0]['x']
    undepth_cells = _undepth_cells(cells) 
    atlas = BrainGlobeAtlas(atlas, check_latest=False)
    save_prob_map = False
    output_directory = 'N/A'
    mask_prob_map = True
    prob_map_smoothing = 100
    prob_map_normalise = True
    probability_map = generate_prob_map(
        output_directory,
        undepth_cells,
        atlas,
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
