import os
import sys
from tifffile import imread

import numpy as np

from cordmap.entry_points.register_3D import main as cordmap_run

data_file = "V3_Cord1_Data_subset.csv"
data_dir = os.path.join(
    os.getcwd(),
    "tests",
    "data",
)


cord_data = os.path.join(data_dir, data_file)


def assert_correct_dimensions(output_directory):
    for file in [
        "transformed_cells.npy",
        "transformed_cord.npy",
        "transformed_gm.npy",
    ]:
        assert np.load(os.path.join(output_directory, file)).ndim == 2

    assert (
        imread(os.path.join(output_directory, "probability_map.tiff")).ndim
        == 3
    )


def test_registration(tmpdir):
    output_directory = os.path.join(str(tmpdir), "output")
    cordmap_args = [
        "cordmap",
        cord_data,
        output_directory,
        "--parallel=False",
        "--debug=True",
        "--debug-slice-number",
        "2",
        "--save-csv",
        "--prob-map=True",
        "--atlas",
        "allen_cord_20um",
        "--atlas_limit",
        "270",
    ]

    sys.argv = cordmap_args
    cordmap_run()

    assert_correct_dimensions(output_directory)


def test_registration_parallel(tmpdir):
    output_directory = os.path.join(str(tmpdir), "output")
    cordmap_args = [
        "cordmap",
        cord_data,
        output_directory,
        "--debug=True",
        "--debug-slice-number",
        "5",
        "--save-csv",
        "--prob-map=True",
        "--n-free-cpus",
        "0",  # needed for CI
        "--atlas",
        "allen_cord_20um",
        "--atlas_limit",
        "270",
    ]

    sys.argv = cordmap_args
    cordmap_run()

    assert_correct_dimensions(output_directory)
