from typing import Dict

import numpy as np
from PIL.Image import Image
from matplotlib import pyplot as plt

from api.constants import PopulationPersistentFiles
from api.helpers.density_map.common_plot_helpers import setup_matplotlib_figure, plot_to_shifted_image
from api.helpers.density_map.generate_image import get_grey_and_white_matter_image_array
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.icustom_atlas import ICustomAtlas
from workspaces.settings import UPSCALE_FACTOR


class CentroidsCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array
    ) -> Dict[PopulationPersistentFiles, Image]:
        return {PopulationPersistentFiles.CENTROIDS_IMG: _generate_centroids(bg_atlas, subdivision, points)}


def _generate_centroids(
        bg_atlas: ICustomAtlas, subdivision: str, points: np.array
) -> Image:
    points_slice = points[:, 1:] * UPSCALE_FACTOR
    im = get_grey_and_white_matter_image_array(bg_atlas, subdivision)

    fig, ax = setup_matplotlib_figure(im)
    plt.scatter(x=points_slice[:, 1], y=points_slice[:, 0], c="y", s=1 * UPSCALE_FACTOR)
    return plot_to_shifted_image(fig, bg_atlas, subdivision)
