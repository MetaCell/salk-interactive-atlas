import numpy as np
from bg_atlasapi import BrainGlobeAtlas
from matplotlib import pyplot as plt
from PIL import Image
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.density_map.iimage_creator import IImageCreator
from api.helpers.image_manipulation import fig_to_img


class CentroidsCreator(IImageCreator):

    def get_image(self, bg_atlas: BrainGlobeAtlas, subdivision: str, points: np.array) -> Image:
        return _generate_centroids(bg_atlas, subdivision, points)


def _generate_centroids(bg_atlas: BrainGlobeAtlas, subdivision: str, points: np.array) -> Image:
    subdivision_limits = get_subdivision_limits(bg_atlas, subdivision)
    points_slice = points[np.logical_and(subdivision_limits[0] <= points[:, 0], points[:, 0] <= subdivision_limits[1])]
    points_slice = points_slice[:, 1:]
    px = 1 / plt.rcParams['figure.dpi']  # pixel in inches
    plt_1 = plt.figure(figsize=(bg_atlas.annotation.shape[2] * px, bg_atlas.annotation.shape[1] * px))
    plt.gca().invert_yaxis()
    plt.axis('off')
    plt.plot(points_slice[:, 1], points_slice[:, 0], 'o', color='white', markersize=0.5)
    plt.gca().set_position([0, 0, 1, 1])
    return fig_to_img(plt_1)
