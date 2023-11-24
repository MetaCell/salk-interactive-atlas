import matplotlib as mpl
import numpy as np
from matplotlib import pyplot as plt
from scipy.ndimage import zoom
from skimage.filters import gaussian

from cordmap.data.utils import cumulative_cord_length
from cordmap.get_segmented_images_upsampled import interpolate_atlas_section
from cordmap.postprocessing.prob_map import get_bins


def get_segment_min_max_values(points, segment, smoothing, atlas):
    probability_map, points_in_subsegment = get_subsegment_probability_map(
        points, segment, smoothing, atlas=atlas
    )
    if probability_map is not None:
        segment_min, segment_max = (
            np.min(probability_map[np.nonzero(probability_map)]),
            probability_map.max(),
        )
        return segment_min, segment_max
    else:
        return None, None


def get_sample_min_max_values(points, segments, smoothing, atlas):
    max_val = 0
    min_val = 1000
    for segment in segments:
        print(segment)

        segment_min, segment_max = get_segment_min_max_values(
            points,
            segment,
            smoothing,
            atlas,
        )
        if segment_min is not None:
            max_val = max(max_val, segment_max)
            min_val = min(min_val, segment_min)
    return min_val, max_val


def get_points_in_segment(points, segment):
    s = cumulative_cord_length(segment, include_this_segment=False)
    e = cumulative_cord_length(segment, include_this_segment=True)
    return points[np.logical_and(points[:, 0] > s, points[:, 0] < e)]


def get_points_in_subsegment(points, annotation_plane, segment_label, atlas):

    segment_start, segment_end = atlas.get_segment_start_and_end(segment_label)
    midpoint = int((segment_start + segment_end) / 2)

    if annotation_plane == 0.25:
        s = segment_start
        e = midpoint
        subsegment_points = points[
            np.logical_and(points[:, 0] > s, points[:, 0] < e)
        ]

    elif annotation_plane == 0.75:
        s = midpoint
        e = segment_end
        subsegment_points = points[
            np.logical_and(points[:, 0] > s, points[:, 0] < e)
        ]

    else:
        raise NotImplementedError()

    return subsegment_points


def get_upsampled_atlas_image(atlas, segment, segment_position=0.25):
    image = atlas.get_arbitrary_segment_image(
        segment, atlas.annotation, segment_position
    )
    image = interpolate_atlas_section(image, order=1, upsample_factor=4)
    return image


def get_subsegment_probability_map(
    all_points,
    segment,
    smoothing,
    atlas,
    upsample_factor=4,
    density=False,
    rostral=True,
):
    slice_position = 0.75 if rostral else 0.25
    points_in_subsegment = get_points_in_subsegment(
        all_points, slice_position, segment, atlas
    )[:, 1:]
    if len(points_in_subsegment) == 0:
        return None
    bins = get_bins(atlas.annotation.shape[1:], (1, 1))
    probability_map, _ = np.histogramdd(
        points_in_subsegment, bins=bins, density=density
    )
    if upsample_factor > 1:
        probability_map = zoom(
            probability_map, (4, 4), order=0, prefilter=False
        )
    smoothing_factor = [x * upsample_factor for x in smoothing]
    probability_map = gaussian(probability_map, sigma=smoothing_factor)

    return probability_map, points_in_subsegment


def get_min_max_all_samples(sample_paths, segments, smoothing, atlas):
    max_val = 0
    min_val = 1000
    all_mins = []
    all_maxs = []
    for p in sample_paths:
        print(p)
        contour_points = np.load(str(p))
        sample_min, sample_max = get_sample_min_max_values(
            contour_points, segments, smoothing, atlas
        )
        max_val = max(max_val, sample_max)
        min_val = min(min_val, sample_min)
        all_mins.append(sample_min)
        all_maxs.append(sample_max)
    return min_val, max_val, all_mins, all_maxs


def plot_overlay_heatmap(img, threshold):
    masked_data = np.ma.masked_where(img < threshold, img)
    plt.imshow(
        masked_data, cmap=mpl.colormaps["hot"], interpolation="none", alpha=0.5
    )
