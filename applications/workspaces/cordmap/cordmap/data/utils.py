import numpy as np
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
    cell_type_name: str = "OpenUpTriangle",
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

    cells_slice = extract_slice_2d(
        data_by_type[cell_type_name], slice, (offset_0, offset_1)
    )
    cord_slice = extract_slice_2d(
        data_by_type[cord_exterior_type_name], slice, (offset_0, offset_1)
    )
    gm_slice = extract_slice_2d(
        data_by_type[grey_matter_type_name], slice, (offset_0, offset_1)
    )

    centroid = np.array((max_y - offset_0, -offset_1))

    return cells_slice, cord_slice, gm_slice, centroid
