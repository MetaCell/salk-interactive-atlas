import os

from pathlib import Path
from cordmap.data import io


data_file = "V3_Cord1_Data_subset.csv"
metadata_file = "V3_Cord1_Key_subset.csv"

data_dir = os.path.join(
    os.getcwd(),
    "tests",
    "data",
)


cord_data = os.path.join(data_dir, data_file)
cord_metadata = os.path.join(data_dir, metadata_file)

len_metadata = 22
raw_data_shape = (200000, 9)
C1_left_val = 2
raw_data_first_X_val = 389.97
raw_data_first_Y_val = -484.18


def test_get_metadata_filename():
    assert io.get_metadata_filename(cord_data) == Path(cord_metadata)


def test_load_metadata_from_file():
    metadata = io.load_metadata_from_file(cord_metadata)
    assert len(metadata) == len_metadata
    assert metadata["C1Left"] == C1_left_val


def test_load_metadata():
    metadata = io.load_metadata(cord_data)
    assert len(metadata) == len_metadata
    assert metadata["C1Left"] == C1_left_val


def load_raw_data():
    raw_data = io.load_raw_data(cord_data, flip_y=False)
    assert raw_data.shape == raw_data_shape
    assert raw_data["X"][0] == raw_data_first_X_val
    assert raw_data["Y"][0] == raw_data_first_Y_val

    raw_data, max_y = io.load_raw_data(cord_data, flip_y=True)
    assert raw_data.shape == raw_data_shape
    assert raw_data["X"][0] == raw_data_first_X_val
    assert raw_data["Y"][0] == max_y - raw_data_first_Y_val


def test_load_data():
    raw_data, metadata, max_y = io.load_data(cord_data, flip_y=False)
    assert raw_data.shape == raw_data_shape
    assert raw_data["X"][0] == raw_data_first_X_val
    assert raw_data["Y"][0] == raw_data_first_Y_val
    assert max_y is None

    assert len(metadata) == len_metadata
    assert metadata["C1Left"] == C1_left_val

    raw_data, metadata, max_y = io.load_data(cord_data)
    assert raw_data["Y"][0] == max_y - raw_data_first_Y_val
