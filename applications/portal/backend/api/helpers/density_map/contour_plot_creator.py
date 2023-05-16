import numpy as np
from PIL import Image
from matplotlib import pyplot as plt
from matplotlib_inline.backend_inline import FigureCanvas
from skimage.filters import gaussian

from api.helpers.density_map.common_density_helpers import (
    get_bins,
    get_subdivision_bin_limits,
)
from api.helpers.density_map.generate_image import shift_image_array, get_canal_offset
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.icustom_atlas import ICustomAtlas
from api.helpers.image_manipulation import (
    apply_greyscale_alpha_mask,
    get_image_from_array,
)

CONTOUR_LEVELS = [0.1470, 0.2940, 0.4410, 0.5881, 0.7351, 0.8821,
                  1.0292, 1.1762, 1.3232]


class ContourPlotCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array
    ) -> Image:
        return _generate_contour_plot(bg_atlas, subdivision, points)


def _generate_contour_plot(
        bg_atlas: ICustomAtlas, subdivision: str, points: np.array
) -> Image:
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

    subdivision_middle = int((bin_limits[0][0] - bin_limits[0][1]) // 2)
    probability_map_2d = probability_map[subdivision_middle, :, :]

    fig, ax = plt.subplots()

    _ = ax.contour(
        probability_map_2d,
        levels=CONTOUR_LEVELS,
        colors="k",
        linewidths=1, )

    # Set the background to white
    ax.axis('off')

    plt.show()

    # Convert plot to numpy array
    canvas = FigureCanvas(fig)
    canvas.draw()  # draw the canvas, cache the renderer

    # Get the image data and reshape it
    image = np.frombuffer(canvas.tostring_rgb(), dtype='uint8')
    image = image.reshape(canvas.get_width_height()[::-1] + (3,))

    # Convert the image to grayscale
    image = np.dot(image[..., :3], [0.2989, 0.5870, 0.1140])

    shifted_img_array = shift_image_array(image, get_canal_offset(bg_atlas, subdivision))
    img = get_image_from_array(shifted_img_array)
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
