from typing import Dict

import matplotlib.cm as cm
import numpy as np
from PIL.Image import Image
from matplotlib import pyplot as plt
from scipy.ndimage import zoom
from skimage.filters import gaussian

from api.constants import PopulationPersistentFiles
from api.helpers.density_map.common_density_helpers import get_bins
from api.helpers.density_map.common_plot_helpers import setup_matplotlib_figure, plot_to_shifted_image
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.icustom_atlas import ICustomAtlas

RESIDENTIAL_CONTOUR_LEVELS = [0.04162026, 0.08324051, 0.12486076, 0.16648102, 0.20810127, 0.24972153, 0.29134178,
                              0.33296203, 0.37458229, 0.41620254, 0.4578228, 0.49944305, 0.5410633, 0.58268356]

CONTOUR_LEVELS = [0.0258, 0.0516, 0.0775, 0.1033, 0.1291, 0.1549, 0.1807, 0.2066, 0.2324, 0.2582, 0.2840, 0.3098,
                  0.3356, 0.3615]

SMOOTHING = 40


class ContourPlotCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array, is_residential: bool
    ) -> Dict[PopulationPersistentFiles, Image]:
        smoothing = [int(round(SMOOTHING / res)) for res in bg_atlas.resolution[1:]]
        probability_map = _get_subdivision_probability_map(
            bg_atlas.annotation.shape[1:], points, smoothing=smoothing,
        )

        fig, ax = setup_matplotlib_figure(probability_map)
        # Generate the base plot
        _plot_contours(ax, probability_map, is_residential)
        image_without_overlay = plot_to_shifted_image(fig, bg_atlas, subdivision)

        # Now add the overlay
        _plot_overlay_heatmap(ax, probability_map, CONTOUR_LEVELS[0])
        image_with_overlay = plot_to_shifted_image(fig, bg_atlas, subdivision)

        return {
            PopulationPersistentFiles.CONTOUR_PLOT_IMG: image_without_overlay,
            PopulationPersistentFiles.CONTOUR_PLOT_WITH_OVERLAY_IMG: image_with_overlay
        }


def _plot_contours(ax, probability_map, is_residential):
    contour_levels = RESIDENTIAL_CONTOUR_LEVELS if is_residential else CONTOUR_LEVELS
    ax.contour(
        probability_map,
        corner_mask=False,
        levels=contour_levels,
        cmap=cm.gray_r,
        zorder=100,
        linewidths=2,
    )


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


def _plot_overlay_heatmap(ax, img, threshold):
    masked_data = np.ma.masked_where(img < threshold, img)

    # Now plot the overlay on the existing axis, the 'alpha' parameter controls the transparency
    ax.imshow(masked_data, cmap=cm.gray_r, interpolation="none", alpha=0.5)
