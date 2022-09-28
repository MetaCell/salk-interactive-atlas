from typing import Optional, Tuple

import numpy as np
from PIL import Image
from matplotlib import pyplot as plt
from matplotlib import rcParams

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.atlas import get_subdivision_boundaries
from api.helpers.image_manipulation import fig_to_img, pad_image
from api.utils import get_closest_multiple
from workspaces.settings import (
    GRID_COLOR,
    GRID_CONSTANT_BOTTOM_OFFSET,
    GRID_CONSTANT_RIGHT_OFFSET,
    GRID_SUBREGION_DEPTH_ZERO_REFERENCE,
    UM_TO_MM, GRID_FONT_SIZE, GRID_X_RANGE, GRID_Y_RANGE, GRID_Z_TITLE_PAD, GRID_X_LABEL_ROTATION,
    GRID_Z_TITLE_VERTICAL_AXES_LOCATION, GRID_AXIS_LABEL_PAD, GRID_X_LABEL_LOC, GRID_Y_LABEL_LOC, GRID_Z_TITLE_LOC,
    GRID_Z_TITLE_VERTICAL_ALIGNMENT, GRID_Z_TITLE_HORIZONTAL_ALIGNMENT, GRID_UNIT, GRID_Z_TITLE, GRID_TICK_STEP,
    GRID_Z_TITLE_BACKGROUND_COLOR,
)


def get_grid_images(
        bg_atlas: ICustomAtlas, subdivision: str
) -> (Image, Image):
    w, h = get_grid_dimensions(bg_atlas)

    fig, ax = plt.subplots()
    # Updates figure size to coop with the labels and ticks
    # So that the plot/grid size is the same size as the atlas shape
    # aka, figure needs to be bigger due to labels and ticks so that the grid is the size we want w x h
    x_shape, y_shape = _set_size(w, h, ax)

    resolution_z = 1 / (bg_atlas.resolution[0] * UM_TO_MM)

    # calculates ratio from image size to atlas size
    ratio_x = w / x_shape
    ratio_y = h / y_shape

    x_ticks, x_ticks_labels = _get_ticks(GRID_X_RANGE, ratio_x)
    y_ticks, y_ticks_labels = _get_ticks(GRID_Y_RANGE, ratio_y)

    ax.set_xticks(x_ticks)
    ax.set_yticks(y_ticks)
    ax.set_xticklabels(x_ticks_labels, rotation=GRID_X_LABEL_ROTATION)
    ax.set_yticklabels(y_ticks_labels)

    ax.set_xlabel(GRID_UNIT, labelpad=GRID_AXIS_LABEL_PAD, loc=GRID_X_LABEL_LOC, fontsize=GRID_FONT_SIZE)
    ax.set_ylabel(GRID_UNIT, labelpad=GRID_AXIS_LABEL_PAD, loc=GRID_Y_LABEL_LOC, fontsize=GRID_FONT_SIZE)
    ax.set_title(
        f"{GRID_Z_TITLE} {_get_subdivision_depth(bg_atlas, subdivision, resolution_z)} {GRID_UNIT}",
        fontdict={
            "fontsize": GRID_FONT_SIZE,
            "fontweight": rcParams["axes.titleweight"],
            "color": GRID_COLOR,
            "verticalalignment": GRID_Z_TITLE_VERTICAL_ALIGNMENT,
            "horizontalalignment": GRID_Z_TITLE_HORIZONTAL_ALIGNMENT,
        },
        loc=GRID_Z_TITLE_LOC,
        y=GRID_Z_TITLE_VERTICAL_AXES_LOCATION,
        pad=GRID_Z_TITLE_PAD,
        backgroundcolor=GRID_Z_TITLE_BACKGROUND_COLOR,
    )

    # Sets axis color
    ax.spines["bottom"].set_color(GRID_COLOR)
    ax.spines["top"].set_color(GRID_COLOR)
    ax.spines["left"].set_color(GRID_COLOR)
    ax.spines["right"].set_color(GRID_COLOR)
    ax.xaxis.label.set_color(GRID_COLOR)
    ax.yaxis.label.set_color(GRID_COLOR)
    ax.tick_params(axis="x", colors=GRID_COLOR)
    ax.tick_params(axis="y", colors=GRID_COLOR)

    for item in (
            [ax.title, ax.xaxis.label, ax.yaxis.label]
            + ax.get_xticklabels()
            + ax.get_yticklabels()
    ):
        item.set_fontsize(GRID_FONT_SIZE)

    plt.grid(False)
    frame_img = fig_to_img(fig)
    plt.grid(True)
    complete_img = fig_to_img(fig)

    # Corrects images alignment by adding a constant amount of padding to the image
    frame_shifted_image = pad_image(
        frame_img, 0, GRID_CONSTANT_RIGHT_OFFSET, GRID_CONSTANT_BOTTOM_OFFSET, 0
    )
    complete_shifted_image = pad_image(
        complete_img, 0, GRID_CONSTANT_RIGHT_OFFSET, GRID_CONSTANT_BOTTOM_OFFSET, 0
    )
    return frame_shifted_image, complete_shifted_image


def get_grid_dimensions(bg_atlas: ICustomAtlas, tick_step: float = GRID_TICK_STEP, tolerance: float = 0.1) -> \
        Tuple[float, float]:
    """
    Gets the grid dimensions based on the {bg_atlas} shape 
    Considering the {tick_step} and {tolerance} we make it so that the ticks happen on 'nice' places and not congested
    """

    resolution_height = 1 / (bg_atlas.resolution[1] * UM_TO_MM)
    resolution_width = 1 / (bg_atlas.resolution[2] * UM_TO_MM)
    _, atlas_height, atlas_width = bg_atlas.shape

    return _get_best_grid_dimension(atlas_width * resolution_width, tick_step, tolerance), \
           _get_best_grid_dimension(atlas_height * resolution_height, tick_step, tolerance)


def _get_best_grid_dimension(axis_dimension: float, step: float, tolerance: float = 0.1) -> float:
    """
    Chooses a multiple of {step} with a difference of at least {tolerance}% to the {dimension} value
    so that we get a 'pleasant to the eyes' - aka with some white space - grid dimension
    """
    semi_axis_dimension = axis_dimension / 2
    if tolerance > 1 or tolerance < 0:
        return axis_dimension
    multiplier, semi_axis_best_dimension = get_closest_multiple(semi_axis_dimension, step)
    if _exceeds_tolerance(semi_axis_best_dimension, semi_axis_dimension, tolerance):
        return semi_axis_best_dimension * 2
    iterations = 1 / tolerance
    while iterations > 0:
        multiplier += 1
        semi_axis_best_dimension = step * multiplier
        if _exceeds_tolerance(semi_axis_best_dimension, semi_axis_dimension, tolerance):
            return semi_axis_best_dimension * 2
        iterations -= 1
    return axis_dimension


def _exceeds_tolerance(new_dimension: float, dimension: float, tolerance: float) -> float:
    return (new_dimension - dimension) / dimension > tolerance


def _get_ticks(rg: tuple, img_to_res_ratio: float, step: float = 0.25):
    # ticks are on image scale
    step_img_scale = step / img_to_res_ratio
    ticks = np.arange(
        rg[0] / img_to_res_ratio,
        rg[1] / img_to_res_ratio + step_img_scale,
        step_img_scale,
    )
    # tick labels apply the canal center offset
    ticks_labels = []
    for idx, tick in enumerate(ticks):
        label = round(tick * img_to_res_ratio, 2)
        if abs(label) == 0:
            label = 0.0
        ticks_labels.append(label)
    return ticks, ticks_labels


def _set_size(w, h, ax=None) -> (float, float):
    """w, h: width, height in inches"""
    if not ax:
        ax = plt.gca()
    l = ax.figure.subplotpars.left
    r = ax.figure.subplotpars.right
    t = ax.figure.subplotpars.top
    b = ax.figure.subplotpars.bottom
    fig_w = float(w) / (r - l)
    fig_h = float(h) / (t - b)
    ax.figure.set_size_inches(fig_w, fig_h)
    return fig_w, fig_h


def _get_subdivision_depth(
        bg_atlas: ICustomAtlas,
        subdivision: str,
        resolution: int,
        subregion_zero_reference: str = GRID_SUBREGION_DEPTH_ZERO_REFERENCE,
) -> Optional[int]:
    breakpoints, subdivisions = get_subdivision_boundaries(bg_atlas)
    subdivision_depth = _get_first_slice_depth(breakpoints, subdivisions, subdivision)
    depth = (
            _get_first_slice_depth(breakpoints, subdivisions, subregion_zero_reference)
            - subdivision_depth
    )
    return round(depth * resolution, 3)


def _get_first_slice_depth(breakpoints, subdivisions, subdivision) -> int:
    index = subdivisions.index(subdivision)
    if index == 0:
        return 0
    return breakpoints[index - 1]
