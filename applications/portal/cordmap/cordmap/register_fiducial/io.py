import logging
import pathlib
from pathlib import Path

import numpy as np
import pandas as pd
from skimage.draw import polygon

from cordmap.register.elastix import register

MARKER_LABELS = [
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "L8",
    "L9",
]


def get_population_labels_from_file(csv_file_path):
    df = pd.read_csv(csv_file_path)
    return set(df[~df["point"].isin(MARKER_LABELS)]["point"].dropna().values)


def load_interpolated_atlas_fiducials(atlas):
    """
     Fiducial markers have been annotated on a downsampled version of the
     salk_10um cord atlas and then interpolated to resample back to atlas
     resolution. This upsampled data is loaded here.

     e.g.    Atlas register_fiducial markers
     --------------------------------------
                 L9    L5     L6

             L8        L4         L1

                L7     L3     L2
    ---------------------------------------
     :return:
    """
    df = pd.read_csv(atlas.fiducial_markers_path())
    return df


def get_atlas_slice_fiducial_raw(z, atlas):
    """
    Loads register_fiducial markers for a single axial position (Z)
    of the atlas.

    :param z:
    :return:
    """
    df = load_interpolated_atlas_fiducials(atlas)
    return df[df["z"] == z]


def remove_padding(markers_df_slice):
    """
    Removes image padding and offsets

    :param markers_df_slice:
    :return:
    """
    markers_df_slice["x"] -= markers_df_slice["x"].min()
    markers_df_slice["y"] -= markers_df_slice["y"].min()
    return markers_df_slice


def correct_raw_coordinates(markers_df_slice):
    """
    The raw data provided by Sofia has some peculiarities, namely that
    there is an artificial offset present that must be removed on loading.
    The data are not centered around 0. The x position of the left hemisphere
    coordinates were relative to 0 and the right hemisphere coordinates
    relativeto the middle coordinate.

    e.g.               Raw                                     Corrected
    ---------------------------------------------------------------------------------
            L9          L5     L6          |                L9    L5     L6
                                           |
        L8              L4         L1      |  ---->     L8        L4         L1
                                           |
           L7           L3     L2          |               L7     L3     L2
    ---------------------------------------------------------------------------------

    :param markers_df_slice:
    :return:
    """

    markers_df_slice.loc[markers_df_slice["x"] < 0, "x"] += markers_df_slice[
        markers_df_slice["label"] == 4
    ]["x"].values
    markers_df_slice.loc[markers_df_slice["x"] > 0, "x"] -= markers_df_slice[
        markers_df_slice["label"] == 4
    ]["x"].values


def load_df_preprocessed(sample, z, normalise=True):
    """
    Loads single axial slice of a cord sample and applies all
    preprocessing to prepare sample image for registration.

    :param sample:
    :param z:
    :param normalise:
    :param scale_factor:
    :return:
    """

    df_slice_z = load_sample_slice(z, sample)

    def get_label(point):

        if point[0] == "L" and point[1].isdigit():
            return int(point[1])
        else:
            return np.nan

    def correct_single_side_offset(df_slice_z):
        return all(
            df_slice_z[df_slice_z["point"].isin(["L7", "L8", "L9"])][
                "x"
            ].values
            < 0
        )

    df_slice_z["label"] = [get_label(point) for point in df_slice_z["point"]]

    if correct_single_side_offset(df_slice_z):
        correct_raw_coordinates(df_slice_z)

    if normalise:
        df_slice_z = remove_padding(df_slice_z)

    fiducial_markers = df_slice_z[df_slice_z["point"].isin(MARKER_LABELS)]
    cells = df_slice_z[~df_slice_z["point"].isin(MARKER_LABELS)]
    cell_labels = df_slice_z[~df_slice_z["point"].isin(MARKER_LABELS)][
        "point"
    ].values

    return fiducial_markers, cells, cell_labels


def load_sample_slice(z, sample):
    """
    Loads a slice at the given axial position (Z), where 0 is the C8 boundary.

    :param z:
    :param sample:
    :return:
    """
    df_slice_z = sample[sample["z"] == z]
    return df_slice_z


def load_sample(path):
    """
    Loads an entire cord sample from csv format.
    Typically, the file should be organised as follows:

    point               | x | y | z |
    ----------------------------------
     L1                 |   |   |   |
     L2                 |   |   |   |
     ...                |   |   |   |
     cell_population1   |   |   |   |
     cell_population1   |   |   |   |
     cell_population2   |   |   |   |
     ...

    :param path:
    :return:
    """
    df = pd.read_csv(path)
    return df


def map_points(points):
    """
    To create a contour from the ficucial markers we need the register_fiducial
    markers in a particular order. This function will map the marker points
    to the contour order.

    0 -> 0
    1 -> 1
    2 -> 2
    3 -> centroid
    4 -> 6
    5 -> 7
    6 -> 3
    7 -> 4
    8 -> 5
    """

    contour_x = [
        float(points[points["label"] == label]["x"].values)
        for label in [1, 2, 3, 7, 8, 9, 5, 6]
    ]
    contour_y = [
        float(points[points["label"] == label]["y"].values)
        for label in [1, 2, 3, 7, 8, 9, 5, 6]
    ]

    return contour_x, contour_y


def register_fiducial(
    fixed_image,
    moving_image,
    fixed_points,
    moving_points,
    rigid=True,
    affine=True,
    bspline=True,
    use_control_points=False,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
):
    """
    Registration function for the register_fiducial marker pipeline.

    :param fixed_image:
    :param moving_image:
    :param fixed_points:
    :param moving_points:
    :param rigid:
    :param affine:
    :param bspline:
    :param use_control_points:
    :param image_metric_weight:
    :param point_metric_weight:
    :return:
    """
    transformed_atlas, result_transform_parameters = register(
        fixed_image,
        moving_image,
        rigid=rigid,
        affine=affine,
        bspline=bspline,
        registration_metric="AdvancedMeanSquares",
        affine_iterations="2048",
        log=False,
        use_control_points=use_control_points,
        image_metric_weight=image_metric_weight,
        point_metric_weight=point_metric_weight,
        fixed_points=fixed_points,
        moving_points=moving_points,
    )
    return transformed_atlas, result_transform_parameters


def get_as_image(points, padding=10):
    """
    Generates image mask from a set of register_fiducial marker points arranged
    in contour order (see: map_points).

    :param points:
    :param padding:
    :return:
    """
    x, y = map_points(points)
    rr, cc = polygon(
        np.array(x) + int(padding), np.array(y) + int(padding), None
    )
    if len(rr) == 0:
        raise PolygonGenerationError()
    img = np.zeros((int(np.max(rr)) + padding, int(np.max(cc) + padding)))
    img[rr, cc] = 255
    return img.T


def save_output(
    output_directory,
    labeled_cells,
    transformed_cells,
    save_csv=True,
    save_npy=True,
):
    """
    Saves registration output files to disk.

    :param output_directory:
    :param labeled_cells:
    :param transformed_cells:
    :param save_csv:
    :param save_npy:
    :return:
    """
    output_directory = Path(output_directory)
    if not output_directory.exists():
        output_directory.mkdir(parents=True)

    logging.info("Summarising cell positions")

    if save_csv:
        labeled_cells.to_csv(
            output_directory / "cells_with_labels.csv", index=False
        )
        save_individual_populations(output_directory, format="csv")

    if save_npy:
        np.save(
            str(output_directory / "transformed_cells.npy"), transformed_cells
        )
        save_individual_populations(output_directory, format="npy")


def save_individual_populations(output_directory, format="csv"):
    """
    Often there are multiple populations of cells with different markers
    this function saves these as separate files.

    :param output_directory:
    :param format:
    :return:
    """

    p = pathlib.Path(output_directory) / "cells_with_labels.csv"
    df = pd.read_csv(p)
    population_keys = df["population_key"].unique()
    logging.info(f"Saving detected populations: {population_keys}")

    for k in population_keys:
        popdf = df[df["population_key"] == k]
        p_out = pathlib.Path(output_directory) / f"transformed_cells_{k}"

        if format == "npy":
            pop_coords = np.array(popdf[["z", "y", "x"]])
            logging.info(f"Saving : {k} to {str(p_out)} as numpy array")
            np.save(
                str(p_out),
                np.array(pop_coords),
            )
        elif format == "csv":
            logging.info(f"Saving : {k} to {str(p_out)} as csv")
            popdf.to_csv(str(p_out) + ".csv", index=False)
    np.save(
        str(pathlib.Path(output_directory) / "transformed_cells"),
        np.array(df[["z", "y", "x"]]),
    )


class PolygonGenerationError(Exception):
    pass
