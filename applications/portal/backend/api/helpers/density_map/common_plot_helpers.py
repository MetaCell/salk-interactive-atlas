from tkinter import Image
from typing import Tuple, Any

import numpy as np
from matplotlib import pyplot as plt
from matplotlib.figure import Figure

from api.helpers.density_map.generate_image import get_pad_from_offset, get_canal_offset
from api.helpers.icustom_atlas import ICustomAtlas
from api.helpers.image_manipulation import fig_to_img, pad_image
from workspaces.settings import FIGURE_DPI


def setup_matplotlib_figure(image_array: np.array) -> Tuple[Figure, Any]:
    dpi = FIGURE_DPI
    h, w = image_array.shape
    xmin, xmax, ymin, ymax = -0.5, w + 0.5, -0.5, h + 0.5
    fig = plt.figure(figsize=(w / dpi, h / dpi), dpi=dpi)
    ax = plt.Axes(fig, (0, 0, 1, 1))
    ax.set_xlim(xmin, xmax)
    ax.set_ylim(ymin, ymax)
    ax.invert_yaxis()
    fig.add_axes(ax)
    fig.set_facecolor((0, 0, 0, 0))
    plt.grid(False)
    plt.axis("off")
    return fig, ax


def plot_to_shifted_image(fig: Figure, bg_atlas: ICustomAtlas, subdivision: str) -> Image:
    img = fig_to_img(fig)
    plt.close('all')
    return pad_image(img, *get_pad_from_offset(get_canal_offset(bg_atlas, subdivision)))
