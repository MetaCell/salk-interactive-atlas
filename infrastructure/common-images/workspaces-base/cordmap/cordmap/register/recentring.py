import numpy as np


def recenter_coordinates(cells_slice: np.array, offset_x: int, offset_y: int):
    """
    Adds x and y positional offsets to contour
    array to center it around the slice midpoint.
    :param cells_slice:
    :param offset_x:
    :param offset_y:
    :return:
    """
    for cell in cells_slice:
        cell[1] += offset_x
        cell[0] += offset_y
    return cells_slice


def get_slice_center(image):

    image_pixel_locs = np.where(image)
    center_of_image_mask = np.mean(image_pixel_locs, axis=1)
    return center_of_image_mask


def align_slice_to_center(
    image_slice: np.ndarray,
    cells_slice: np.array,
    gm_slice: np.array,
    cord_slice: np.array,
    padding=20,
):
    """
    Detects misalignment in slice image and uses
    the x and y offsets to align all data around the slice
    midpoint before registration.
    :param image_slice:
    :param cells_slice:
    :param gm_slice:
    :param cord_slice:
    :return:
    """

    slice_center = get_slice_center(image_slice)
    image_center_x, image_center_y, x_offset, y_offset = get_offsets(
        slice_center, image_slice
    )

    new_img = align_image_to_center(
        image_slice,
        image_center_x,
        image_center_y,
        x_offset,
        y_offset,
        padding=padding,
    )

    x_offset += padding / 2
    y_offset += padding / 2

    cells_slice = recenter_coordinates(cells_slice, x_offset, y_offset)
    gm_slice = recenter_coordinates(gm_slice, x_offset, y_offset)
    cord_slice = recenter_coordinates(cord_slice, x_offset, y_offset)

    return new_img, cells_slice, gm_slice, cord_slice


def align_image_to_center(
    image_slice, center_x, center_y, x_offset, y_offset, padding=10
):
    """

    :param center_x:
    :param center_y:
    :param x_offset:
    :param y_offset:
    :param pixel_locs:
    :param image_slice:
    :return:
    """

    new_img = np.zeros(
        (image_slice.shape[0] + padding, image_slice.shape[1] + padding)
    )
    pixel_locs = np.where(image_slice)

    for x, y in zip(pixel_locs[1], pixel_locs[0]):
        new_img[y + int(y_offset), x + int(x_offset)] = image_slice[y, x]
    return new_img


def get_offsets(center_of_slice, image_slice):
    x_max = image_slice.shape[1]
    y_max = image_slice.shape[0]
    image_center_x = int(x_max / 2)
    image_center_y = int(y_max / 2)
    slice_center_y = center_of_slice[0]
    slice_center_x = center_of_slice[1]
    y_offset = image_center_y - slice_center_y
    x_offset = image_center_x - slice_center_x
    return image_center_x, image_center_y, x_offset, y_offset
