import logging
from pathlib import Path

import numpy as np
from skimage.filters import gaussian
from tifffile import imsave

from cordmap.utils.image import mask_image_threshold
from cordmap.utils.misc import ensure_directory_exists

"""
Mostly from github.com/brainglobe/cellfinder
"""


def get_bins(image_size, bin_sizes):
    """
    Given an image size, and bin size, return a list of the bin boundaries
    :param image_size: Size of the final image (tuple/list)
    :param bin_sizes: Bin sizes corresponding to the dimensions of
    "image_size" (tuple/list)
    :return: List of arrays of bin boundaries
    """
    bins = []
    for dim in range(0, len(image_size)):
        bins.append(np.arange(0, image_size[dim] + 1, bin_sizes[dim]))
    return bins


def generate_prob_map(
    output_directory,
    points,
    atlas,
    save_map=True,
    smoothing=None,
    mask=True,
    normalise=True,
):
    output_directory = Path(output_directory)
    output_filename = output_directory / "probability_map.tiff"

    bins = get_bins(atlas.annotation.shape, (1, 1, 1))
    probability_map, _ = np.histogramdd(points, bins=bins, density=normalise)

    if smoothing is not None:
        logging.debug("Smoothing probability map")
        smoothing = [int(round(smoothing / res)) for res in atlas.resolution]
        probability_map = gaussian(probability_map, sigma=smoothing)

    if mask:
        logging.debug("Masking image based on registered atlas")
        probability_map = mask_image_threshold(
            probability_map, atlas.annotation
        )

    logging.debug("Saving probability map")

    if save_map:
        logging.debug("Ensuring output directory exists")
        ensure_directory_exists(output_filename.parent)

        logging.debug("Saving heatmap image")
        imsave(output_filename, probability_map)

    return probability_map
