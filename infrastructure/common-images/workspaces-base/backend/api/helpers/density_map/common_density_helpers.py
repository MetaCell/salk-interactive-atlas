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
                return s['Start'], (s["Start"] + s["End"]) / 2, 0.25
            else:
                return (s["Start"] + s["End"]) / 2, s['End'], 0.75


def get_subdivision_bin_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    return get_subdivision_limits(bg_atlas, subdivision), None, None


def get_img_geometric_center(img_array) -> (float, float):
    return math.floor(img_array.shape[1] / 2), math.floor(img_array.shape[0] / 2)


def _bounding_box_coords(img_array) -> (float, float, float, float):
    rows = np.any(img_array, axis=1)
    cols = np.any(img_array, axis=0)
    top, bottom = np.where(rows)[0][[0, -1]]
    left, right = np.where(cols)[0][[0, -1]]

    return left, top, right, bottom


def get_img_content_center(img_array) -> (float, float):
    left, top, right, bottom = _bounding_box_coords(img_array)
    return math.floor((right + left) / 2), math.floor((top + bottom) / 2)


def sub_cords(t1, t2) -> (float, float):
    return (t1[0] - t2[0]) * 1.0, (t1[1] - t2[1]) * 1.0
