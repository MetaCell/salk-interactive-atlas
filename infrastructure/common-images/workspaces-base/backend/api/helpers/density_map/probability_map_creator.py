import numpy as np
from PIL import Image

from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.density_map.common_density_helpers import get_subdivision_bin_limits, get_bins
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from skimage.filters import gaussian
from api.helpers.image_manipulation import get_image_from_array, apply_greyscale_alpha_mask


class ProbabilityMapCreator(IPopulationImageCreator):

    def create(self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array) -> Image:
        return _generate_probability_map(bg_atlas, subdivision, points)


def _generate_probability_map(bg_atlas: ICustomAtlas, subdivision: str, points: np.array) -> Image:
    prob_map_smoothing = 50
    prob_map_normalise = True
    bin_limits = get_subdivision_bin_limits(bg_atlas, subdivision)
    probability_map = _generate_prob_map(
        points,
        bg_atlas,
        bin_limits=bin_limits,
        smoothing=prob_map_smoothing,
        normalise=prob_map_normalise,
    )
    img_data = _get_accumulated_probability_map(probability_map)
    scaled_image_data = 256 / np.max(img_data) * img_data
    img = get_image_from_array(scaled_image_data)
    return apply_greyscale_alpha_mask(img)


def _generate_prob_map(
        points: np.array,
        bg_atlas: ICustomAtlas,
        bin_limits: tuple = (None, None, None),
        normalise: bool = True,
        smoothing: int = None,
) -> np.array:
    bins = get_bins(bg_atlas.annotation.shape, (1, 1, 1), bin_limits)
    probability_map, _ = np.histogramdd(points, bins=bins, density=normalise)
    if smoothing is not None:
        smoothing = [int(round(smoothing / res)) for res in bg_atlas.resolution]
        probability_map = gaussian(probability_map, sigma=smoothing)
    return probability_map


def _get_accumulated_probability_map(probability_map: np.array) -> np.array:
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)
