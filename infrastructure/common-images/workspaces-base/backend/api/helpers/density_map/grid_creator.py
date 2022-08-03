from typing import Optional

from PIL import Image
from matplotlib import pyplot as plt, rcParams

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.atlas import get_subdivision_boundaries
from api.helpers.density_map.common_density_helpers import get_img_geometric_center, get_img_content_center, sub_cords
from api.helpers.image_manipulation import fig_to_img

CONSTANT_RIGHT_OFFSET = 10
CONSTANT_BOTTOM_OFFSET = 1
UM_TO_MM = 10


def get_grid_image(bg_atlas: ICustomAtlas, subdivision: str, canal_img_array: Image) -> Image:
    geometric_center = get_img_geometric_center(canal_img_array)
    canal_center = get_img_content_center(canal_img_array)
    canal_offset = sub_cords(geometric_center, canal_center)
    canal_offset_x, canal_offset_y = canal_offset

    dpi = 100
    h, w = canal_img_array.shape
    h = h / dpi
    w = w / dpi

    fig, ax = plt.subplots()
    x_shape, y_shape = _set_size(w, h, ax)

    resolution_x = 1 / (bg_atlas.resolution[2] * UM_TO_MM)
    resolution_y = 1 / (bg_atlas.resolution[1] * UM_TO_MM)

    ratio_x = w / x_shape
    ratio_y = h / y_shape

    canal_offset_x *= resolution_x
    canal_offset_y *= resolution_y * -1

    x_ticks = [canal_offset_x * -1 - x_shape / 2, canal_offset_x * -1, canal_offset_x * -1 + x_shape / 2]
    x_ticks_labels = [round((x - canal_offset_x * -1) * ratio_x, 2) for x in x_ticks]

    y_ticks = [canal_offset_y * -1 - y_shape / 2, canal_offset_y * -1, + canal_offset_y * -1 + y_shape / 2]
    y_ticks_labels = [round((y - canal_offset_y * -1) * ratio_y, 2) for y in y_ticks]

    ax.set_xticks([-x_shape / 2, canal_offset_x, x_shape / 2])
    ax.set_yticks(y_ticks)
    ax.set_xticklabels(x_ticks_labels)
    ax.set_yticklabels(y_ticks_labels)

    ax.set_title(f'{_get_subdivision_depth(bg_atlas, subdivision)} mm',
                 fontdict={'fontsize': 8,
                           'fontweight': rcParams['axes.titleweight'],
                           'verticalalignment': 'baseline',
                           'horizontalalignment': 'right'},
                 loc='right')

    for item in ([ax.title, ax.xaxis.label, ax.yaxis.label] +
                 ax.get_xticklabels() + ax.get_yticklabels()):
        item.set_fontsize(8)

    plt.grid(False)
    img = fig_to_img(fig)
    shifted_image = _add_margin(img, 0, CONSTANT_RIGHT_OFFSET, CONSTANT_BOTTOM_OFFSET, 0)
    return shifted_image


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


def _get_subdivision_depth(bg_atlas: ICustomAtlas, subdivision: str) -> Optional[int]:
    reference = 'C8-Rostral'
    breakpoints, subdivisions = get_subdivision_boundaries(bg_atlas)
    subdivision_depth = _get_first_slice_depth(breakpoints, subdivisions, subdivision)
    depth = _get_first_slice_depth(breakpoints, subdivisions, reference) - subdivision_depth
    return depth


def _get_first_slice_depth(breakpoints, subdivisions, subdivision) -> int:
    index = subdivisions.index(subdivision)
    if index == 0:
        return 0
    return breakpoints[index - 1]

