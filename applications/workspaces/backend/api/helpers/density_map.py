import math

import numpy as np
from matplotlib import pyplot as plt
from skimage.filters import gaussian

from api.helpers.image_manipulation import black_to_transparent, get_image_from_array, apply_greyscale_alpha_mask, \
    fig_to_img

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


def generate_annotation_image(bg_atlas, subdivision):
    subdivision_limits = _get_subdivision_limits(bg_atlas, subdivision)
    middle_point = int((subdivision_limits[0] + subdivision_limits[1]) / 2)
    annot_array = bg_atlas.annotation[middle_point]
    # scale image to 'greyish' tons (max value matches with #808080 (128))
    scaled_annot_array = 128 / np.max(annot_array) * annot_array
    annot_img = get_image_from_array(scaled_annot_array, 'RGB')
    return black_to_transparent(annot_img)


def generate_centroids(bg_atlas, subdivision, points):
    subdivision_limits = _get_subdivision_limits(bg_atlas, subdivision)
    points_slice = points[np.logical_and(subdivision_limits[0] <= points[:, 0], points[:, 0] <= subdivision_limits[1])]
    points_slice = points_slice[:, 1:]
    px = 1 / plt.rcParams['figure.dpi']  # pixel in inches
    plt_1 = plt.figure(figsize=(bg_atlas.annotation.shape[2] * px, bg_atlas.annotation.shape[1] * px))
    plt.gca().invert_yaxis()
    plt.axis('off')
    plt.plot(points_slice[:, 1], points_slice[:, 0], 'o', color='white', markersize=0.5)
    plt.gca().set_position([0, 0, 1, 1])
    return fig_to_img(plt_1)


def generate_density_map(bg_atlas, subdivision, cells):
    prob_map_smoothing = 50
    prob_map_normalise = True
    bin_limits = _get_subdivision_bin_limits(bg_atlas, subdivision)
    probability_map = _generate_prob_map(
        cells,
        bg_atlas,
        bin_limits=bin_limits,
        smoothing=prob_map_smoothing,
        normalise=prob_map_normalise,
    )
    img_data = _get_accumulated_probability_map(probability_map)
    scaled_image_data = 256 / np.max(img_data) * img_data
    img = get_image_from_array(scaled_image_data)
    return apply_greyscale_alpha_mask(img)


def _get_bins(image_size, bin_sizes, bin_limits):
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


def _generate_prob_map(
        points,
        bg_atlas,
        bin_limits=(None, None, None),
        normalise=True,
        smoothing=None,
):
    bins = _get_bins(bg_atlas.annotation.shape, (1, 1, 1), bin_limits)
    probability_map, _ = np.histogramdd(points, bins=bins, density=normalise)
    if smoothing is not None:
        smoothing = [int(round(smoothing / res)) for res in bg_atlas.resolution]
        probability_map = gaussian(probability_map, sigma=smoothing)
    return probability_map


def _get_subdivision_limits(bg_atlas, subdivision):
    segment, part = subdivision.split('-')
    for s in bg_atlas.metadata['atlas_segments']:
        if s['Segment'] == segment:
            if part == ROSTRAL:
                return s['Start'], int(math.floor((s['Start'] + s['End']) / 2))
            else:
                return int(math.ceil((s['Start'] + s['End'])) / 2), s['End']


def _get_subdivision_bin_limits(bg_atlas, subdivision):
    return _get_subdivision_limits(bg_atlas, subdivision), None, None


def _get_accumulated_probability_map(probability_map):
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)
