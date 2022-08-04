from typing import Optional

import numpy as np
from PIL import Image
from matplotlib import pyplot as plt, rcParams

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.atlas import get_subdivision_boundaries
from api.helpers.density_map.common_density_helpers import get_img_geometric_center, get_img_content_center, sub_cords
from api.helpers.image_manipulation import fig_to_img
from workspaces.settings import UM_TO_MM, GRID_COLOR, GRID_CONSTANT_RIGHT_OFFSET, GRID_CONSTANT_BOTTOM_OFFSET, \
    FIGURE_DPI, GRID_SUBREGION_DEPTH_ZERO_REFERENCE


def get_grid_image(bg_atlas: ICustomAtlas, subdivision: str, canal_img_array: Image) -> Image:
    geometric_center = get_img_geometric_center(canal_img_array)
    canal_center = get_img_content_center(canal_img_array)
    canal_offset = sub_cords(geometric_center, canal_center)
    canal_offset_x, canal_offset_y = canal_offset

    dpi = FIGURE_DPI
    h, w = canal_img_array.shape
    h = h / dpi
    w = w / dpi

    fig, ax = plt.subplots()
    # Updates figure size to coop with the labels and ticks
    # So that the plot/grid size is the same size as the atlas shape
    # aka, figure needs to be bigger due to labels and ticks so that the grid is the size we want w x h
    x_shape, y_shape = _set_size(w, h, ax)

    resolution_x = 1 / (bg_atlas.resolution[2] * UM_TO_MM)
    resolution_y = 1 / (bg_atlas.resolution[1] * UM_TO_MM)
    resolution_z = 1 / (bg_atlas.resolution[0] * UM_TO_MM)

    # calculates ratio from image size to atlas size
    ratio_x = w / x_shape
    ratio_y = h / y_shape

    canal_offset_x *= resolution_x
    canal_offset_y *= resolution_y * -1

    x_ticks, x_ticks_labels = _get_ticks(canal_offset_x, ratio_x, x_shape)
    y_ticks, y_ticks_labels = _get_ticks(canal_offset_y, ratio_y, y_shape)

    ax.set_xticks(x_ticks)
    ax.set_yticks(y_ticks)
    ax.set_xticklabels(x_ticks_labels)
    ax.set_yticklabels(y_ticks_labels)

    ax.set_title(f'{_get_subdivision_depth(bg_atlas, subdivision, resolution_z)} mm',
                 fontdict={'fontsize': 8,
                           'fontweight': rcParams['axes.titleweight'],
                           'color': GRID_COLOR,
                           'verticalalignment': 'baseline',
                           'horizontalalignment': 'right'},
                 loc='right')

    # Sets axis color
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.spines['top'].set_color(GRID_COLOR)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['right'].set_color(GRID_COLOR)
    ax.xaxis.label.set_color(GRID_COLOR)
    ax.yaxis.label.set_color(GRID_COLOR)
    ax.tick_params(axis='x', colors=GRID_COLOR)
    ax.tick_params(axis='y', colors=GRID_COLOR)

    for item in ([ax.title, ax.xaxis.label, ax.yaxis.label] +
                 ax.get_xticklabels() + ax.get_yticklabels()):
        item.set_fontsize(8)

    plt.grid(False)
    img = fig_to_img(fig)

    # Corrects image alignment by adding a constant amount of padding to the image
    shifted_image = _add_margin(img, 0, GRID_CONSTANT_RIGHT_OFFSET, GRID_CONSTANT_BOTTOM_OFFSET, 0)
    return shifted_image


def _get_ticks(canal_offset, img_to_res_ratio, shape, step=0.1):
    # ticks are on image scale
    ticks = np.round(
        np.arange(
            _get_tick_rounded(canal_offset * -1 - shape / 2, img_to_res_ratio),
            _get_tick_rounded(canal_offset * -1 + shape / 2 + step, img_to_res_ratio), step),
        2)
    # tick labels apply the canal center offset
    ticks_labels = []
    for idx, tick in enumerate(ticks):
        if idx % 5 == 0:
            label = round((tick - canal_offset * -1) * img_to_res_ratio, 2)
            if round(label, 1) * 10 == 0:
                label = 0
            ticks_labels.append(label)
        else:
            ticks_labels.append('')
    return ticks, ticks_labels


def _get_tick_rounded(original, ratio):
    # gets tick value in the image scale so that it starts with 0 on the 2 decimal place
    scaled = original * ratio
    diff = round(round(scaled, 2) - round(scaled, 1), 2)
    return original + diff / ratio


def _set_size(w, h, ax=None) -> (float, float):
    """ w, h: width, height in inches """
    if not ax: ax = plt.gca()
    l = ax.figure.subplotpars.left
    r = ax.figure.subplotpars.right
    t = ax.figure.subplotpars.top
    b = ax.figure.subplotpars.bottom
    fig_w = float(w) / (r - l)
    fig_h = float(h) / (t - b)
    ax.figure.set_size_inches(fig_w, fig_h)
    return fig_w, fig_h


def _add_margin(pil_img, top, right, bottom, left, color=(255, 0, 0, 0)) -> Image:
    width, height = pil_img.size
    new_width = int(width + right + left)
    new_height = int(height + top + bottom)
    result = Image.new(pil_img.mode, (new_width, new_height), color)
    result.paste(pil_img, (left, top))
    return result


def _get_subdivision_depth(bg_atlas: ICustomAtlas, subdivision: str, resolution: int,
                           subregion_zero_reference: str = GRID_SUBREGION_DEPTH_ZERO_REFERENCE) -> Optional[int]:
    breakpoints, subdivisions = get_subdivision_boundaries(bg_atlas)
    subdivision_depth = _get_first_slice_depth(breakpoints, subdivisions, subdivision)
    depth = _get_first_slice_depth(breakpoints, subdivisions, subregion_zero_reference) - subdivision_depth
    return depth * resolution


def _get_first_slice_depth(breakpoints, subdivisions, subdivision) -> int:
    index = subdivisions.index(subdivision)
    if index == 0:
        return 0
    return breakpoints[index - 1]
