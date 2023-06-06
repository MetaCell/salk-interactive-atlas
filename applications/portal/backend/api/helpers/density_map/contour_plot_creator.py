import numpy as np
from PIL import Image
from matplotlib import pyplot as plt
from matplotlib_inline.backend_inline import FigureCanvas
from scipy.ndimage import zoom
from skimage.filters import gaussian

from api.helpers.density_map.common_density_helpers import get_bins
from api.helpers.density_map.generate_image import shift_image_array, get_canal_offset
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.icustom_atlas import ICustomAtlas
from api.helpers.image_manipulation import (
    apply_greyscale_alpha_mask,
    get_image_from_image_array,
)

CONTOUR_LEVELS = [0.1470, 0.2940, 0.4410, 0.5881, 0.7351, 0.8821,
                  1.0292, 1.1762, 1.3232]

SMOOTHING = 40


class ContourPlotCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array
    ) -> Image:
        return _generate_contour_plot(bg_atlas, subdivision, points)


def _generate_contour_plot(
        bg_atlas: ICustomAtlas, subdivision: str, points: np.array
) -> Image:
    probability_map = _get_segment_probability_map(
        bg_atlas.annotation.shape[1:], points, smoothing=SMOOTHING,
    )
    plt.contour(
        probability_map,
        corner_mask=False,
        levels=CONTOUR_LEVELS,
        colors="k",
        zorder=100,
        linewidths=2,
    )

    plt.show()

    # todo: convert plot to image (should be shifted according to the canal offset)


def _get_accumulated_probability_map(probability_map: np.array) -> np.array:
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)


def _get_segment_probability_map(
        atlas_shape, points, smoothing, upsample_factor=4,
):
    bins = get_bins(atlas_shape, (1, 1))
    probability_map, _ = np.histogramdd(
        points[:, 1:], bins=bins, density=False
    )
    probability_map = gaussian(probability_map, sigma=smoothing)
    if upsample_factor > 1:
        probability_map = zoom(
            probability_map, (4, 4), order=0, prefilter=False
        )

    return probability_map
