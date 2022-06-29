import math
import numpy as np
from api.constants import ROSTRAL
from api.helpers.ICustomAtlas import ICustomAtlas


def get_bins(image_size: tuple, bin_sizes: tuple, bin_limits: tuple) -> list:
    """
    Given an image size, and bin size, return a list of the bin boundaries
    :param image_size: Size of the final image (tuple)
    :param bin_sizes: Bin sizes corresponding to the dimensions of
    "image_size" (tuple)
    :param bin_limits: Bin limits corresponding to the dimensions of
    "image_size" (tuple)
    :return: List of arrays of bin boundaries
    """
    bins = []
    for dim in range(0, len(image_size)):
        if bin_limits[dim]:
            bins.append(np.arange(bin_limits[dim][0], bin_limits[dim][1] + 1, bin_sizes[dim]))
        else:
            bins.append(np.arange(0, image_size[dim] + 1, bin_sizes[dim]))
    return bins


def get_subdivision_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    segment, part = subdivision.split('-')
    for s in bg_atlas.metadata['atlas_segments']:
        if s['Segment'] == segment:
            if part == ROSTRAL:
                return s['Start'], int(math.floor((s['Start'] + s['End']) / 2))
            else:
                return int(math.ceil((s['Start'] + s['End'])) / 2), s['End']


def get_subdivision_bin_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    return get_subdivision_limits(bg_atlas, subdivision), None, None
