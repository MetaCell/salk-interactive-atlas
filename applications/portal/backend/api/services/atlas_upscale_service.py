import cachetools
import numpy as np
import scipy
import skimage
from scipy.ndimage import zoom

cached_results = cachetools.LRUCache(maxsize=100)


def get_upsampled_atlas_image_array(atlas, subdivision, segment_position=0.25):
    key = (atlas.get_id(), subdivision, segment_position)
    if key in cached_results:
        return cached_results[key]
    image_idx = atlas.get_section_idx(subdivision, segment_position)
    image_array = interpolate_atlas_section(atlas.annotation[image_idx], order=1, upsample_factor=4)
    cached_results[key] = image_array
    return image_array


def interpolate_atlas_section(img, order, upsample_factor=8):
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


def get_2d_mask(atlas, region_keys, upscaled_image_array):
    image_array = np.full_like(upscaled_image_array, False)
    for region_key in region_keys:
        region_id = atlas.structures[region_key]["id"]
        img_region = upscaled_image_array == (region_id - 1)
        for child in atlas.hierarchy.children(region_id):
            img_region = np.logical_or(img_region, upscaled_image_array == (child.identifier - 1))
        image_array = np.logical_or(image_array, img_region)
    return image_array
