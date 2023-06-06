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
    get_image_from_image_array,
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
    probability_map = _generate_prob_map(
        points,
        bg_atlas,
        smoothing=prob_map_smoothing,
    )

    fig, ax = plt.subplots()

    _ = ax.contour(
        probability_map,
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
    img = get_image_from_image_array(shifted_img_array)
    return apply_greyscale_alpha_mask(img)


def _generate_prob_map(
        points: np.array,
        bg_atlas: ICustomAtlas,
        segment: str = None,
        smoothing: int = None,
        upsample_factor: int = 4,
) -> np.array:
    image = bg_atlas.annotation[bg_atlas.get_section_idx(segment, 0.25)]
    bins = get_bins(image.shape, (1, 1))
    probability_map, _ = np.histogramdd(
        points_in_segment, bins=bins, density=False
    )
    probability_map = gaussian(probability_map, sigma=smoothing)
    if upsample_factor > 1:
        probability_map = zoom(probability_map, (4,4), order=0, prefilter=False)
        image = interpolate_atlas_section(image, order=1, upsample_factor=4)
    return image, probability_map


def _get_accumulated_probability_map(probability_map: np.array) -> np.array:
    acc = np.zeros(probability_map[0].shape, dtype=float)
    for slice in probability_map:
        acc += slice
    return acc / len(probability_map)
