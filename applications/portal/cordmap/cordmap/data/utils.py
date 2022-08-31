import numpy as np
import pathlib
import pandas as pd

from cordmap.register.constants import segments_df
from cordmap.utils.misc import check_set_intersections


def get_data_segments(
    data_by_type, atlas_segments, segment_name_header="Segment"
):
    segment_name_list = list(atlas_segments[segment_name_header])
    segment_z_values = {}
    for segment_name in segment_name_list:
        segment_z_values[segment_name] = np.empty((0,))
        for segment_annotation in data_by_type:
            if segment_name in segment_annotation:
                segment_z = data_by_type[segment_annotation][:, 0]
                segment_z_values[segment_name] = np.append(
                    segment_z_values[segment_name], segment_z
                )

        segment_z_values[segment_name] = set(segment_z_values[segment_name])

    check_set_intersections(segment_z_values, remove=True)
    return segment_z_values


def get_segment_from_z_position(data_z_coordinate, segment_z_values):
    for segment in segment_z_values:
        if data_z_coordinate in segment_z_values[segment]:
            return segment


def get_atlas_z_position_from_segment(data_z_coordinate, segment_z_values):
    segment = get_segment_from_z_position(data_z_coordinate, segment_z_values)
    segment_lower = min(segment_z_values[segment])
    segment_upper = max(segment_z_values[segment])
    segment_position = 1 - (segment_upper - data_z_coordinate) / (
        segment_upper - segment_lower
    )
    segment_slice_index = (
        segments_df[segments_df["Segment"] == segment].values[0][1]
        * segment_position
    )
    cum_atlas_cord_length = cumulative_cord_length(segment)
    return cum_atlas_cord_length + segment_slice_index


def cumulative_cord_length(segment_label):
    idx = segments_df.index[segments_df["Segment"] == segment_label].values[0]
    return segments_df.iloc[:idx].sum().values[1]


def interpolate_atlas_section(
    atlas_section,
    data_z_coordinate,
    segment_z_values,
    atlas_segment,
    atlas_segments,
):
    data_z_values_in_segment = np.array(list(segment_z_values[atlas_segment]))
    min_val = data_z_values_in_segment.min()
    max_val = data_z_values_in_segment.max()
    depth_within_section = (data_z_coordinate - min_val) / (max_val - min_val)

    atlas_segment_info = atlas_segments[
        atlas_segments["Segment"] == atlas_segment
    ]
    atlas_segment_depth = int(atlas_segment_info["End"]) - int(
        atlas_segment_info["Start"]
    )

    interpolated_atlas_coordinate = int(
        atlas_section + (depth_within_section * atlas_segment_depth)
    )

    return interpolated_atlas_coordinate


def filter_data_by_type(data_in, metadata, type_column="Type"):
    data_by_type = {}
    for key in metadata:

        df = data_in[data_in[type_column] == metadata[key]]
        data_by_type[key] = np.vstack(
            (np.array(df["Z"]), np.array(df["Y"]), np.array(df["X"]))
        ).T
    return data_by_type


def extract_slice_2d(points, chosen_slice_z, offsets):
    data_slice = points[points[:, 0] == chosen_slice_z]
    data_slice = np.delete(data_slice, 0, 1)
    for dim in range(2):
        data_slice[:, dim] = data_slice[:, dim] - offsets[dim]
    return data_slice


def create_single_section(
    data_by_type,
    slice,
    max_y,
    cell_type_names,
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    initial_pad=10,
):

    offset_0 = (
        min(data_by_type[cord_exterior_type_name][:, 1]) + initial_pad // 2
    )
    offset_1 = (
        min(data_by_type[cord_exterior_type_name][:, 2]) + initial_pad // 2
    )
    cells_slice_all_pops = []
    cell_pop_labels = []

    for cell_type_name in cell_type_names:
        cell_pop = extract_slice_2d(
            data_by_type[cell_type_name], slice, (offset_0, offset_1)
        )
        cells_slice_all_pops.extend(cell_pop)
        cell_pop_labels.extend([cell_type_name] * len(cell_pop))

    cord_slice = extract_slice_2d(
        data_by_type[cord_exterior_type_name], slice, (offset_0, offset_1)
    )
    gm_slice = extract_slice_2d(
        data_by_type[grey_matter_type_name], slice, (offset_0, offset_1)
    )

    centroid = np.array((max_y - offset_0, -offset_1))

    return (
        np.array(cells_slice_all_pops),
        cord_slice,
        gm_slice,
        centroid,
        cell_pop_labels,
    )


def slice_loading_error_detected(composite_image):
    if len(np.unique(composite_image)) != 3:
        print(
            f"not enough labels found in image, expected 3, "
            f"got {len(np.unique(composite_image))}, "
            f"skipping slice..."
        )
        return True
    if np.count_nonzero(composite_image) < 18000:
        print(
            f"outlier image detected, "
            f"too few labeled pixels {np.count_nonzero(composite_image)}, "
            f"skipping slice..."
        )
        return True
    if np.count_nonzero(composite_image == 2) < 4000:
        print(
            f"outlier image detected, "
            f"too few grey matter pixels {np.count_nonzero(composite_image)}, "
            f"skipping slice..."
        )
        return True


def split_populations(directory):
    folder = pathlib.Path(directory)
    df = pd.read_csv(folder / "cells_with_labels.csv")
    for cell_pop_label in df["population_key"].unique():
        pop_df = df[df["population_key"] == cell_pop_label].reset_index()
        new_filename = f"cells_with_labels_{cell_pop_label}.csv"
        pop_df.to_csv(folder / new_filename)
