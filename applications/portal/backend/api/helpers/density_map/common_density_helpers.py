import math

import numpy as np

from api.helpers.icustom_atlas import ICustomAtlas
from typing import Tuple


def get_bins(image_size: tuple, bin_sizes: tuple, bin_limits: tuple) -> list:
    """
    Given an image size, and bin size, return a list of the bin boundaries.

    Args:
        image_size (tuple): Size of the final image.
        bin_sizes (tuple): Bin sizes corresponding to the dimensions of "image_size".
        bin_limits (tuple): Bin limits corresponding to the dimensions of "image_size".

    Returns:
        list: List of arrays of bin boundaries.
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


def get_subdivision_bin_limits(bg_atlas: ICustomAtlas, subdivision: str) -> tuple:
    """
    Get the subdivision limits of the background atlas.

    Args:
        bg_atlas (ICustomAtlas): A background atlas object.
        subdivision (str): Subdivision of the atlas.

    Returns:
        tuple: Tuple containing the subdivision limits.
    """
    return bg_atlas.get_subdivision_limits(subdivision), None, None


def _get_image_array_geometric_center(img_array) -> (int, int):
    """
    Calculate the geometric center of an image array.

    Args:
        img_array (numpy array): Image data in the form of a numpy array.

    Returns:
        tuple: Tuple containing the coordinates of the geometric center.
    """
    return int(math.floor(img_array.shape[1] / 2)), int(math.floor(img_array.shape[0] / 2))


def _bounding_box_coords(img_array) -> (float, float, float, float):
    """
    Calculates the coordinates of the bounding box that tightly encapsulates non-zero elements in the provided 2D numpy
    array img_array.

    Args:
        img_array (numpy array): Image data in the form of a numpy array.

    Returns:
        tuple: Tuple containing the coordinates of the bounding box (left, top, right, bottom).
    """
    rows = np.any(img_array, axis=1)
    cols = np.any(img_array, axis=0)
    top, bottom = np.where(rows)[0][[0, -1]]
    left, right = np.where(cols)[0][[0, -1]]

    return left, top, right, bottom


def _get_image_array_centroid(img_array) -> (int, int):
    """
    Calculate the content center of an image array.

    Args:
        img_array (numpy array): Image data in the form of a numpy array.

    Returns:
        tuple: Tuple containing the coordinates of the content center.
    """
    left, top, right, bottom = _bounding_box_coords(img_array)
    return int(math.floor((right + left) / 2)), int(math.floor((top + bottom) / 2))


def _sub_cords(t1, t2) -> (int, int):
    """
    Calculate the difference between two tuples.

    Args:
        t1 (tuple): First tuple of integers.
        t2 (tuple): Second tuple of integers.

    Returns:
        tuple: Tuple containing the differences of the respective elements in the input tuples.
    """
    return (t1[0] - t2[0]), (t1[1] - t2[1])


def get_image_array_geometric_vs_centroid_offset(image_array: np.array) -> Tuple[int, int]:
    """
    Calculate the offset of the image array based on the difference between the geometric and content centers.

    Args:
        image_array (numpy array): Image data in the form of a numpy array.

    Returns:
        tuple: Tuple containing the offsets in x and y directions.
    """
    geometric_center = _get_image_array_geometric_center(image_array)
    centroid = _get_image_array_centroid(image_array)
    return _sub_cords(geometric_center, centroid)
