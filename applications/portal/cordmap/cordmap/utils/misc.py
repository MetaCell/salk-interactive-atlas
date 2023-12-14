import logging
import os
from pathlib import Path

import numpy as np
import PIL.Image as Image
import PIL.ImageDraw as ImageDraw


def check_set_intersections(set_dict, remove=False, max_overlap=0):
    """
    Check for duplicate items in a dict of sets, and optionally, remove them
    :param set_dict: Dict of sets
    :param remove: If True, remove the duplicate items, otherwise raise error.
    :return:
    """
    for set_name_a in set_dict:
        for set_name_b in set_dict:
            if set_name_a != set_name_b:
                intersection = set_dict[set_name_a].intersection(
                    set_dict[set_name_b]
                )
                if len(intersection) > max_overlap:
                    if remove:
                        logging.warning(
                            f"Removing items:{intersection} "
                            f"from set: {set_name_b}"
                        )
                        set_dict[set_name_b] = set_dict[set_name_b].difference(
                            intersection
                        )
                    else:
                        logging.warning(
                            f"Sets: {set_name_a} and {set_name_b} "
                            f"contain overlapping elements: {intersection}"
                        )
                else:
                    assert (
                        len(
                            set_dict[set_name_a].intersection(
                                set_dict[set_name_b]
                            )
                        )
                        <= max_overlap
                    )


def draw_polygon(polygon, image_size):
    # PIL coords transposed wrt skimage
    img = Image.new("1", (image_size[1], image_size[0]))

    draw = ImageDraw.Draw(img)
    input_polygon = polygon.astype(int)
    input_polygon = tuple(zip(input_polygon[:, 1], input_polygon[:, 0]))
    draw.polygon((input_polygon), fill=1)
    return np.array(img)


def create_image_from_polygon(
    input_polygon, subsample=0, image_size=None, image_pad=10
):
    if not image_size:
        image_size = int(input_polygon[:, 0].max()) + image_pad, int(
            input_polygon[:, 1].max() + image_pad
        )
    if subsample != 0:
        input_polygon = input_polygon[::subsample]

    return draw_polygon(input_polygon, image_size)


def image_size_from_points_2d(points, padding=0):
    y_max = padding + round(points[:, 0].max())
    x_max = padding + round(points[:, 1].max())
    return (y_max, x_max)


def add_2D_points_to_3D_array(points, z_coordinate, destination_3D_array):
    points = add_z_dim_to_2D_points(points, z_coordinate)
    return np.append(destination_3D_array, points, axis=0)


def add_z_dim_to_2D_points(points, z_coordinate):
    z_coords = z_coordinate * np.ones((len(points), 1))
    return np.append(z_coords, points, axis=1)


def ensure_directory_exists(directory):
    """
    If a directory doesn't exist, make it. Works for pathlib objects, and
    strings.
    :param directory:
    """
    if isinstance(directory, str):
        if not os.path.exists(directory):
            os.makedirs(directory)
    elif isinstance(directory, Path):
        directory.mkdir(exist_ok=True, parents=True)
