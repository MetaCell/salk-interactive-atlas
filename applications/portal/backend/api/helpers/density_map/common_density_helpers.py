import math

import numpy as np

from api.constants import ROSTRAL
from api.helpers.ICustomAtlas import ICustomAtlas
from typing import Tuple


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
            bins.append(
                np.arange(bin_limits[dim][0], bin_limits[dim][1] + 1, bin_sizes[dim])
            )
        else:
            bins.append(np.arange(0, image_size[dim] + 1, bin_sizes[dim]))
    return bins


def get_subdivision_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    segment, part = subdivision.split("-")
    for s in bg_atlas.metadata["atlas_segments"]:
        if s["Segment"] == segment:
            if part == ROSTRAL:
                return s["Start"], (s["Start"] + s["End"]) / 2
            else:
                return (s["Start"] + s["End"]) / 2, s["End"]


def get_subdivision_bin_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    return get_subdivision_limits(bg_atlas, subdivision), None, None


def _get_img_geometric_center(img_array) -> (int, int):
    return int(math.floor(img_array.shape[1] / 2)), int(math.floor(img_array.shape[0] / 2))


def _bounding_box_coords(img_array) -> (float, float, float, float):
    rows = np.any(img_array, axis=1)
    cols = np.any(img_array, axis=0)
    top, bottom = np.where(rows)[0][[0, -1]]
    left, right = np.where(cols)[0][[0, -1]]

    return left, top, right, bottom


def _get_img_content_center(img_array) -> (int, int):
    left, top, right, bottom = _bounding_box_coords(img_array)
    return int(math.floor((right + left) / 2)), int(math.floor((top + bottom) / 2))


def _sub_cords(t1, t2) -> (int, int):
    return (t1[0] - t2[0]), (t1[1] - t2[1])


def get_img_array_offset(img_array: np.array) -> Tuple[int, int]:
    """
    content center might not match with the geometric center of the atlas slice
    We get the bounding box of the array content and calculate the {content_center} coordinates from it
    Atlas slice geometric center can be calculated from the shape
    The difference from the two points give us the translation vector
    :param img_array:
    :return:
    """
    geometric_center = _get_img_geometric_center(img_array)
    content_center = _get_img_content_center(img_array)
    return _sub_cords(geometric_center, content_center)
