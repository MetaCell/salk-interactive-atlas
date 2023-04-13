import pathlib

import math
import numpy as np
import pandas as pd
import random


def generate_cells_from_slice(cells_in_slice_z, jitter, z):
    """
    Takes a given slice that contains cells, selects a random subset
    of 50-100% of cells and adds x / y jitter.

    :param cells_in_slice_z:
    :param jitter:
    :param z:
    :return:
    """
    cells = []
    if len(cells_in_slice_z) > 2:
        number_of_cells_z = random.randrange(
            int(len(cells_in_slice_z) / 2), int(len(cells_in_slice_z))
        )
        for n in range(number_of_cells_z):
            row_idx = random.choice(cells_in_slice_z.index)
            new_cell = cells_in_slice_z.loc[row_idx]
            new_cell["z"] = z
            new_cell["x"] = random.uniform(
                new_cell["x"] - jitter, new_cell["x"] + jitter
            )
            new_cell["y"] = random.uniform(
                new_cell["y"] - jitter, new_cell["y"] + jitter
            )
            cells.append(new_cell)
    return cells


def generate_interpolated_slice_cells(
    cells_in_slice_z1, cells_in_slice_z2, new_z, jitter=2
):
    """
    For aesthetic purposes, this function allows additional planes
    to be inserted between real-data planes to increase the density
    of populations for improved visualisation. Samples from
    neighbouring planes.

    :param cells_in_slice_z1:
    :param cells_in_slice_z2:
    :param new_z:
    :param jitter:
    :return:
    """
    all_cells = []
    all_cells.extend(
        generate_cells_from_slice(cells_in_slice_z1, jitter, new_z)
    )
    all_cells.extend(
        generate_cells_from_slice(cells_in_slice_z2, jitter, new_z)
    )
    return all_cells


def is_outlier(coord, atlas):
    """
    For aesthetic purposes, this function allows cells that
    fall outside the grey matter to be dropped.

    :param coord:
    :param atlas:
    :return:
    """

    if atlas.annotation[
        math.floor(coord[0]), math.floor(coord[1]), math.floor(coord[2])
    ] in [0, 1]:
        return True


def upsample_population(
    output_directory, population_df, pop_label, atlas=None, n_extra_planes=5
):
    """
    Adds cells to intermediate planes in a registered cord using the real-data
    neuronal distribution. For visualisation.

    :param output_directory:
    :param population_df:
    :param pop_label:
    :param atlas:
    :param n_extra_planes:
    :return:
    """

    output_directory = pathlib.Path(output_directory)
    z_pos = population_df["z"].unique()
    all_new_cells = []

    for z1, z2 in zip(z_pos[:-1], z_pos[1:]):
        new_z = np.linspace(z1, z2, 2 + n_extra_planes)[1:-1].astype(int)
        for z in new_z:
            cells_in_slice_z1 = population_df[population_df["z"] == z1]
            cells_in_slice_z2 = population_df[population_df["z"] == z2]

            new_cells = generate_interpolated_slice_cells(
                cells_in_slice_z1, cells_in_slice_z2, z
            )
            all_new_cells.extend(new_cells)

    cells_df = pd.concat(all_new_cells, 1).T.reset_index()

    main_df = pd.concat([cells_df, population_df])
    main_df = main_df[
        [x for x in main_df.keys() if x in ["z", "x", "y", "population_key"]]
    ]
    pop_coords = np.array(main_df[["z", "x", "y"]])

    new_coords = []
    for coord in pop_coords:
        if atlas is not None:
            if is_outlier(coord, atlas):
                continue
        new_coords.append([coord[0], coord[1], coord[2]])

    cell_dict = {
        "z": np.array(new_coords)[:, 0],
        "x": np.array(new_coords)[:, 1],
        "y": np.array(new_coords)[:, 2],
        "population_key": [pop_label] * len(new_coords),
    }
    df_new_pop = pd.DataFrame.from_dict(cell_dict)
    df_new_pop.to_csv(
        output_directory / f"transformed_cells_upsampled_{pop_label}.csv"
    )
    np.save(
        str(output_directory / f"transformed_cells_upsampled_{pop_label}"),
        np.array(new_coords),
    )
    return df_new_pop, np.array(new_coords)
