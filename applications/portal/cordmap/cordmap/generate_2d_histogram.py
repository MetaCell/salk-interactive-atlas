import matplotlib.pyplot as plt
import numpy as np
from bg_atlasapi import BrainGlobeAtlas
from skimage.filters import gaussian

from cordmap.postprocessing.prob_map import get_bins

atlas_name = "salk_cord_10um"
atlas = BrainGlobeAtlas(atlas_name)


def generate_histogram2d(points_file, pos, smoothing=100, axis="x"):

    points = np.load(points_file)
    if axis == "z":
        atlas_resolution = atlas.resolution[1:]
        points_slice = points[np.where(points[:, 0] == pos)]
        points_slice = points_slice[:, 1:]
        bins = get_bins(atlas.annotation.shape[1:], (1, 1))
        atlas_image = atlas.annotation[pos, :, :]
    elif axis == "y":
        atlas_resolution = atlas.resolution[::2]
        points_slice = points[np.where(points[:, 1] == pos)]
        points_slice = points_slice[:, ::2]
        bins = get_bins(atlas.annotation.shape[::2], (1, 1))
        atlas_image = atlas.annotation[:, pos, :]
    elif axis == "x":
        atlas_resolution = atlas.resolution[:-1]
        points_slice = points[np.where(points[:, 2] == pos)]
        points_slice = points_slice[:, :-1]
        bins = get_bins(atlas.annotation.shape[:-1], (1, 1))
        atlas_image = atlas.annotation[:, :, pos]
    probability_map, _ = np.histogramdd(points_slice, bins=bins, density=True)

    if smoothing is not None:
        smoothing = [int(round(smoothing / res)) for res in atlas_resolution]
        probability_map = gaussian(probability_map, sigma=smoothing)

    plt.figure()
    plt.imshow(probability_map)
    [plt.plot(p[1], p[0], "o", color="w") for p in points_slice]

    plt.figure()
    plt.imshow(atlas_image)
    [plt.plot(p[1], p[0], "o", color="w") for p in points_slice]
    plt.show()
