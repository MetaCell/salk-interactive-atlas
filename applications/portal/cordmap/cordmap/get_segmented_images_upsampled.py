import scipy.ndimage

from cordmap.register_fiducial.bgatlasapi_wrapper import SalkAtlas
from scipy.ndimage import zoom

import numpy as np
import skimage
import skimage.morphology

atlas = SalkAtlas("salk_cord_10um")


def interpolate_atlas_section(img, order, upsample_factor=8):
    """
    This function is used to upscale individual atlas images (2D)
    Each image is made up of many labels that need to be upsampled and
    smoothed individually. Small areas (such as the layers 1-4) are susceptible
    to smoothing deterioration because they are very thin so these are grouped
    with other similar labels before smoothing to make them more robust. The
    image is then pieced back together in a specific order.

    :param img: a cross-sectional (2D) image from the salk atlas.
    :param order: the zoom order
    :param upsample_factor:
    :return:
    """
    img = img.astype(float)
    smoothed_all_labels = np.zeros(
        (
            int(img.shape[0]) * upsample_factor,
            int(img.shape[1]) * upsample_factor,
        )
    )
    for label in np.unique(img):

        if label == 0:
            continue

        new_img = np.zeros_like(img)

        if label < 11:
            mask = img >= label
        else:
            mask = img == label

        new_img[mask] = 1
        new_img = scipy.ndimage.gaussian_filter(new_img, sigma=2)
        new_img = zoom(
            new_img,
            (upsample_factor, upsample_factor),
            order=order,
            prefilter=False,
        )
        new_img = new_img > 0.3
        new_img = skimage.morphology.binary_opening(new_img.astype(int))
        smoothed_all_labels[new_img] = label
    return smoothed_all_labels.astype(int)
