import pathlib

import pandas as pd

from cordmap.data.io import load_data
from cordmap.data.utils import filter_data_by_type
from cordmap.register.constants import population_ignore_set
from cordmap.register.register_sections import get_segment_keys


def get_all_population_keys(data_directory):
    p = pathlib.Path(data_directory)
    p.rglob("*key*")

    population_keys = []
    for fpath in p.rglob("*key*"):
        population_keys = get_populations_from_file(
            fpath, population_ignore_set, population_keys
        )
    return population_keys


def get_populations_from_file(fpath, ignore_set, population_keys=None):
    if population_keys is None:
        population_keys = []
    data_name = fpath.parts[-1].replace("Key", "Data")
    key_name = fpath.parts[-1].replace("Data", "Key")
    data_fpath = fpath.parent / data_name
    key_fpath = fpath.parent / key_name

    df = pd.read_csv(key_fpath)
    data, metadata, max_y = load_data(data_fpath)
    data_by_type = filter_data_by_type(data, metadata)
    segment_keys = get_segment_keys(data_by_type)

    for k in df[df["isPoint"] == 1]["objectNames"].values:
        k = k.strip()
        if k not in segment_keys and k not in ignore_set:
            population_keys.append(k)
    return population_keys
