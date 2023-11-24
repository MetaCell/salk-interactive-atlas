import pathlib
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt

from cordmap.register_fiducial.bgatlasapi_wrapper import SalkAtlas
from cordmap.representative_populations.contour_plotting_2d_functions import (
    get_sample_min_max_values,
    get_subsegment_probability_map,
    get_min_max_all_samples,
    get_upsampled_atlas_image,
)

"""
This is a script for locally generating contour plots for cell populations.

This includes:

Estimation of the contour range from all samples included in the analysis.

This contour range is estimated by looking at every subsegment that will be
displayed in the viewer (e.g. C1 rostral) getting all cells in the region,
generating a population histogram and taking the maximum value for each
subsegment for all samples. The median of these values is taken and used
to set the upper value of the contour range. The minimum value is the median
of all minimum values estimated similarly to the max values.

For generating contour levels we specify the number of levels we want to have,
which can be specified by the user.

If sample_range_levels is true, then the contour levels will be instead
calculated individually on a sample by sample basis.

"""


sample_directory = pathlib.Path("D:\\resident_populations\\")
sample_paths = list(sample_directory.rglob("*.npy"))
output_directory = pathlib.Path("D:\\contours\\")


atlas = SalkAtlas("salk_cord_10um")
smoothing = 40
smoothing = [int(round(smoothing / res)) for res in atlas.resolution[1:]]
upsample_factor = 4
n_contours = 12
segments = [
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "C7",
    "C8",
    "T1",
]
sample_range_levels = False

_, _, all_mins, all_maxs = get_min_max_all_samples(
    sample_paths, segments, smoothing, atlas
)
min_val = np.median(all_mins)
max_val = np.median(all_maxs)
contour_levels = np.linspace(min_val, max_val, n_contours)[1:]
segments_to_compare = [
    "C2",
    "C8",
]  # which two segments to plot. Can be 2 only in this example.

for p in sample_paths:
    points = np.load(str(p))

    if sample_range_levels:
        min_val, max_val = get_sample_min_max_values(
            atlas, points, segments, smoothing
        )
        contour_levels = np.linspace(min_val, max_val, n_contours)[1:]

    fig, axes = plt.subplots(2, 2, figsize=(12, 5))
    for i, segment in enumerate(segments_to_compare):
        output_filename = (
            output_directory / f"probability_map_{p.parent.stem}_{segment}.png"
        )

        probability_map, points_in_subsegment = get_subsegment_probability_map(
            points, segment, smoothing=smoothing, atlas=atlas, rostral=False
        )

        if probability_map is not None:

            ax = plt.sca(axes[0][i])
            plt.title(segment)

            image = get_upsampled_atlas_image(
                atlas, segment, segment_position=0.25
            )

            plt.imshow(image, cmap=mpl.colormaps["Greys"])

            plt.contour(
                probability_map,
                corner_mask=True,
                levels=contour_levels,
                cmap=mpl.rcParams["image.cmap"],
                zorder=100,
                linewidths=1,
                alpha=1,
            )

            # because atlas image we are displaying on is upsampled by
            # factor of 4 we need to transform the points that we want
            # to plot as an overlay. This has already been computed for
            # the heatmap.

            x = points_in_subsegment[:, 1] * upsample_factor
            y = points_in_subsegment[:, 0] * upsample_factor
            plt.plot(x, y, "o", markersize=1, color="k")
            plt.axis("off")

            plt.subplots_adjust(left=0.02, right=0.98)
    plt.show()
    fig.savefig(output_directory / f"{p.parent.stem}_{p.stem}.png")
