import math

import numpy as np
from PIL import Image
from skimage.filters import gaussian
from api.helpers.atlas import get_bg_atlas
from api.services.population_service import get_cells

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


def generate_density_map(atlas, subdivision, populations):
    bg_atlas = get_bg_atlas(atlas)
    cells = get_cells(subdivision, populations)
    prob_map_smoothing = 100
    prob_map_normalise = True
    bin_limits = get_subdivision_bin_limits(atlas, subdivision)

    probability_map = generate_prob_map(
        cells,
        bg_atlas,
        bin_limits=bin_limits,
        smoothing=prob_map_smoothing,
        normalise=prob_map_normalise,
    )
    img = get_accumulated_probability_map(probability_map)
    scaled_image = 256 / np.max(img) * img

    i = Image.fromarray(scaled_image)
    i = i.convert('RGBA')
    mask = i.convert('L')
    i.putalpha(mask)

    return i


def get_bins(image_size, bin_sizes, bin_limits):
    """
    Given an image size, and bin size, return a list of the bin boundaries
    :param image_size: Size of the final image (tuple/list)
    :param bin_sizes: Bin sizes corresponding to the dimensions of
    "image_size" (tuple/list)
    :param bin_limits: Bin limits corresponding to the dimensions of
    "image_size" (tuple/list)
    :return: List of arrays of bin boundaries
    """
    bins = []
    for dim in range(0, len(image_size)):
        if bin_limits[dim]:
            bins.append(np.arange(bin_limits[dim][0], bin_limits[dim][1] + 1, bin_sizes[dim]))
        else:
            bins.append(np.arange(0, image_size[dim] + 1, bin_sizes[dim]))
    return bins


def generate_prob_map(
        points,
        atlas,
        bin_limits=(None, None, None),
        normalise=True,
        smoothing=None,
):
    bins = get_bins(atlas.annotation.shape, (1, 1, 1), bin_limits)
    probability_map, _ = np.histogramdd(points, bins=bins, density=normalise)
    if smoothing is not None:
        smoothing = [int(round(smoothing / res)) for res in atlas.resolution]
        probability_map = gaussian(probability_map, sigma=smoothing)
    return probability_map


def get_subdivision_bin_limits(atlas, subdivision):
    segment, part = subdivision.split('-')
    for s in atlas.metadata['atlas_segments']:
        if s['Segment'] == segment:
            if part == ROSTRAL:
                return (s['Start'], int(math.floor((s['Start']+s['End'])/2))), None, None
            else:
                return (int(math.ceil((s['Start']+s['End']))/2), s['End']), None, None
    return None, None, None


def get_accumulated_probability_map(probability_map):
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)
