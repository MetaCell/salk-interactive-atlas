import pathlib
import numpy as np
import matplotlib.pyplot as plt
from cordmap.representative_populations.util import (
    plot_section,
    get_representative_population,
)
from cordmap.register_fiducial.bgatlasapi_wrapper import SalkAtlas

"""
This is a script for generating a 'representative' population of
cell coordinates from a set of samples.

To create representative populations from individually acquired
samples we first run cordmap on all the samples for a given
cardinal group (i.e. V1 cord1, V1 cord2, V1 cord3).

We then generate an average cell probability map using data from
all samples. This probability map is artificially cut around the
GM/WM border because the density map will otherwise generate cell
positions that lie outside the grey matter. This is because of the
nature of generating and smoothing density plots.

 We then randomly draw N cells from a distribution which matches
 this probability map. This means that the likelihood of creating
 a datapoint is related to the density of cells in the raw data.

The user can specify the number of cells and just needs to provide
file paths to the cells of each sample in atlas space (i.e. the
transformed_cells.npy file that cordmap provides when run locally).

The user can also specify the upscaling factor. If set to 1 then the
number of neurons created will match the average number of neurons
in the average sample. If not, it will be that number multiplied by
the upscaling factor.

The user can also set the amount of smoothing in this probability
density heatmap.

"""

atlas = SalkAtlas("salk_cord_10um")
smoothing = 40  # factor to smooth by (is sigma * 10)
directory = pathlib.Path(
    "D:\\data\\metacell\\salk\\resident_populations\\"
)  # folder containing the raw data samples
output_directory = (
    directory / "output"
)  # directory for saving any intermediate results (e.g. pop histograms)
upscaling_factor = 4  # Number of times to multiply cell number by
display_output = True  # Whether to plot some example sections
step = 100  # plot every nth image if display_output is True

v1_paths = [
    str(output_directory / "V1_Cord1_Data\\transformed_cells.npy"),
    str(output_directory / "V1_Cord2_Data\\transformed_cells.npy"),
    str(output_directory / "V1_Cord3_Data\\transformed_cells.npy"),
]

v2a_paths = [
    str(output_directory / "V2a_Cord1_Data\\transformed_cells.npy"),
    str(output_directory / "V2a_Cord2_Data\\transformed_cells.npy"),
    str(output_directory / "V2a_Cord3_Data\\transformed_cells.npy"),
]

v2b_paths = [
    str(output_directory / "V2b_Cord1_Data\\transformed_cells.npy"),
    str(output_directory / "V2b_Cord2_Data\\transformed_cells.npy"),
]

v3_paths = [
    str(output_directory / "V3_Cord1_Data\\transformed_cells.npy"),
    str(output_directory / "V3_Cord2_Data\\transformed_cells.npy"),
    str(output_directory / "V3_Cord3_Data\\transformed_cells.npy"),
]


for sample_paths, sample_name in zip(
    [v1_paths, v2a_paths, v2b_paths, v3_paths], ["V1", "V2a", "V2b", "V3"]
):

    coordinates, probability_map = get_representative_population(
        sample_paths,
        smoothing,
        atlas,
        output_directory,
        upsample_factor=upscaling_factor,
    )
    np.save(
        f"{output_directory}\\{sample_name}_{upscaling_factor}x.npy",
        coordinates,
    )

    if display_output:
        for i in range(0, len(atlas.annotation), step):
            plt.figure()
            plot_section(i, atlas, coordinates, probability_map, alpha=0)
            plt.show()
