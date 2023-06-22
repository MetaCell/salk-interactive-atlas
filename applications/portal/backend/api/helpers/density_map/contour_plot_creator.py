import numpy as np
from PIL import Image
import matplotlib as mpl
from matplotlib import pyplot as plt
from scipy.ndimage import zoom
from skimage.filters import gaussian

from api.helpers.density_map.common_density_helpers import get_bins
from api.helpers.density_map.common_plot_helpers import setup_matplotlib_figure
from api.helpers.density_map.generate_image import get_canal_offset, get_pad_from_offset
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.icustom_atlas import ICustomAtlas
from api.helpers.image_manipulation import (
    fig_to_img, pad_image,
)

CONTOUR_LEVELS = [0.04162026, 0.08324051, 0.12486076, 0.16648102, 0.20810127, 0.24972153, 0.29134178, 0.33296203,
                  0.37458229, 0.41620254, 0.4578228, 0.49944305, 0.5410633, 0.58268356]

SMOOTHING = 40


class ContourPlotCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array
    ) -> Image:
        return _generate_contour_plot(bg_atlas, subdivision, points)


def _generate_contour_plot(
        bg_atlas: ICustomAtlas, subdivision: str, points: np.array
) -> Image:
    smoothing = [int(round(SMOOTHING / res)) for res in bg_atlas.resolution[1:]]

    probability_map = _get_subdivision_probability_map(
        bg_atlas.annotation.shape[1:], points, smoothing=smoothing,
    )

    fig, ax = setup_matplotlib_figure(probability_map)
    _plot_overlay_heatmap(probability_map, CONTOUR_LEVELS[0])
    plt.contour(
        probability_map,
        corner_mask=False,
        levels=CONTOUR_LEVELS,
        colors="k",
        zorder=100,
        linewidths=2,
    )
    img = fig_to_img(fig)
    return pad_image(img, *get_pad_from_offset(get_canal_offset(bg_atlas, subdivision)))


def _get_accumulated_probability_map(probability_map: np.array) -> np.array:
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)


def _get_subdivision_probability_map(
        atlas_shape, points, smoothing, upsample_factor=4, density=False,

):
    bins = get_bins(atlas_shape, (1, 1))
    probability_map, _ = np.histogramdd(
        points[:, 1:], bins=bins, density=density
    )
    if upsample_factor > 1:
        probability_map = zoom(
            probability_map, (upsample_factor, upsample_factor), order=0, prefilter=False
        )
    smoothing_factor = [x * upsample_factor for x in smoothing]
    probability_map = gaussian(probability_map, sigma=smoothing_factor)
    return probability_map


def _plot_overlay_heatmap(img, threshold):
    masked_data = np.ma.masked_where(img < threshold, img)
    plt.imshow(
        masked_data, cmap=mpl.colormaps["hot"], interpolation="none", alpha=0.5
    )
