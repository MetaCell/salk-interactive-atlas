import matplotlib.image as mimage
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import rcParams
from PIL import Image

from api.constants import FULLY_OPAQUE
from api.helpers.density_map.common_density_helpers import get_subdivision_limits
from api.helpers.density_map.generate_image import get_annotation_array, shift_image_array, get_canal_offset, \
    get_pad_from_offset
from api.helpers.density_map.ipopulation_image_creator import IPopulationImageCreator
from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.image_manipulation import fig_to_img, fig_to_numpy, get_image_from_array, black_to_transparent, \
    pad_image
from workspaces.settings import FIGURE_DPI


class CentroidsCreator(IPopulationImageCreator):
    def create(
            self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array
    ) -> Image:
        return _generate_centroids(bg_atlas, subdivision, points)


def _generate_centroids(
        bg_atlas: ICustomAtlas, subdivision: str, points: np.array
) -> Image:
    subdivision_limits = get_subdivision_limits(bg_atlas, subdivision)
    points_slice = points[
        np.logical_and(
            subdivision_limits[0] <= points[:, 0], points[:, 0] <= subdivision_limits[1]
        )
    ]
    points_slice = points_slice[:, 1:]
    im = get_annotation_array(bg_atlas, subdivision)
    dpi = FIGURE_DPI
    h, w = im.shape
    xmin, xmax, ymin, ymax = -0.5, w + 0.5, -0.5, h + 0.5
    fig = plt.figure(figsize=(w / dpi, h / dpi), dpi=dpi)
    ax = plt.Axes(fig, (0, 0, 1, 1))
    ax.set_xlim(xmin, xmax)
    ax.set_ylim(ymin, ymax)
    ax.invert_yaxis()
    fig.add_axes(ax)
    fig.set_facecolor((0, 0, 0, 0))
    _imshow(ax, im)
    plt.scatter(x=points_slice[:, 1], y=points_slice[:, 0], c="y", s=1)
    plt.grid(False)
    plt.axis("off")
    img = fig_to_img(fig)
    return pad_image(img, *get_pad_from_offset(get_canal_offset(bg_atlas, subdivision)))


def _imshow(
        axis,
        X,
        cmap=None,
        norm=None,
        aspect=None,
        interpolation=None,
        alpha=None,
        vmin=None,
        vmax=None,
        origin=None,
        extent=None,
        *,
        interpolation_stage=None,
        filternorm=True,
        filterrad=4.0,
        resample=None,
        url=None,
        **kwargs
):
    if aspect is None:
        aspect = rcParams["image.aspect"]
    axis.set_aspect(aspect)
    im = mimage.AxesImage(
        axis,
        cmap,
        norm,
        interpolation,
        origin,
        extent,
        filternorm=filternorm,
        filterrad=filterrad,
        resample=resample,
        interpolation_stage=interpolation_stage,
        **kwargs
    )

    im.set_data(X)
    im.set_alpha(alpha)
    if im.get_clip_path() is None:
        # image does not already have clipping set, clip to axes patch
        im.set_clip_path(axis.patch)
    im._scale_norm(norm, vmin, vmax)
    im.set_url(url)

    # update ax.dataLim, and, if autoscaling, set viewLim
    # to tightly fit the image, regardless of dataLim.
    im.set_extent(im.get_extent())

    return im
