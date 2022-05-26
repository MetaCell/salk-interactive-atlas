import logging
import pandas as pd
import numpy as np

from pathlib import Path

from cordmap.postprocessing.analyse import summarise_points


def save_output(
    output_directory,
    transformed_cells,
    transformed_gm,
    transformed_cord,
    atlas,
    save_csv=True,
    save_npy=True,
):
    output_directory = Path(output_directory)

    logging.info("Summarising cell positions")
    summarise_points(
        transformed_cells,
        atlas,
        output_directory / "cell_summary.csv",
    )
    if not save_npy and not save_csv:
        logging.warning("Saving to CSV and .npy disabled, defaulting to .npy")
        save_npy = True

    if save_csv:
        points_to_csv(
            transformed_cells, output_directory / "transformed_cells.csv"
        )
        points_to_csv(transformed_gm, output_directory / "transformed_gm.csv")
        points_to_csv(
            transformed_cord, output_directory / "transformed_cord.csv"
        )

    if save_npy:
        np.save(output_directory / "transformed_cells.npy", transformed_cells)
        np.save(output_directory / "transformed_gm.npy", transformed_gm)
        np.save(output_directory / "transformed_cord.npy", transformed_cord)


def points_to_csv(points, filename):
    points = pd.DataFrame(points)
    points.to_csv(filename, header=False, index=False)


def load_data(data_path, flip_y=True):
    """
    Load raw data and metadata
    :param data_path: Path to the data csv file.
    :param flip_y: "Flip" the Y values, i.e. new_y = max_y - y
    :return: Raw data dataframe,
    dict of metadata key-value pairs,
    and if "flip_y" is True, also the maximum Y value (otherwise None)
    """
    if flip_y:
        data, max_y = load_raw_data(data_path, flip_y=flip_y)
    else:
        max_y = None
        data = load_raw_data(data_path, flip_y=flip_y)
    metadata = load_metadata(data_path)
    return data, metadata, max_y


def load_raw_data(data_path, flip_y=True):
    """
    Load raw data from csv file
    :param data_path: Path to the data csv file.
    :param flip_y: "Flip" the Y values, i.e. new_y = max_y - y
    :return: Raw data dataframe, and if "flip_y" is True, also the maximum
    Y value.
    """
    df = pd.read_csv(data_path)
    if flip_y:
        max_y = df["Y"].max()
        df["Y"] = max_y - df["Y"]
        return df, max_y
    else:
        return df


def load_metadata(data_csv_file):
    """
    Return dict of metadata from key file
    :param data_csv_file: Path to the data csv file. The metadata (key)
    filename is inferred from this
    :return: Dict of metadata key-value pairs
    """
    metadata_file = get_metadata_filename(data_csv_file)
    return load_metadata_from_file(metadata_file)


def get_metadata_filename(
    data_filename, data_string="_Data", metadata_string="_Key"
):
    """
    Infer the metadata (key) filename from the data filename.
    :param data_filename: Path to the data csv file. The metadata (key)
    filename is inferred from this
    :param data_string: String to be replaced, identifying the data file
    :param metadata_string: String identifying the metadata file
    :return: Path to the metadata (key) file
    """
    data_filename = Path(data_filename)
    metadata_stem = data_filename.name.replace(data_string, metadata_string)
    return (data_filename.parent / metadata_stem).with_suffix(
        data_filename.suffix
    )


def load_metadata_from_file(
    metdata_file, columns_keep=["objectNames", "Type"]
):
    """
    Load metadata (key) data
    :param metdata_file: Path to the metadata (key) file
    :param columns_keep: List of columns from the csv to retain
    :return: Dict of metadata key-value pairs
    """
    df = pd.read_csv(metdata_file)
    df = df[columns_keep]
    return dict(df.values)
