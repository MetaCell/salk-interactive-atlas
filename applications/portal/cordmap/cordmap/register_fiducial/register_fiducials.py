import pandas as pd

from cordmap.register_fiducial.register import register_fiducial_single_section
from cordmap.register.register_sections import update_labeled_cells
from cordmap.utils.misc import add_2D_points_to_3D_array


def register_single_section_fiducial_serial(
    atlas,
    sample,
    z_position_sample,
    transformed_cells,
    labeled_cells: pd.DataFrame,
    cell_type_names: list,
    image_padding=10,
):
    output = register_fiducial_single_section(
        atlas,
        sample,
        z_position_sample,
        image_padding,
    )

    # if data has a corresponding atlas section
    if output is not None:

        (
            z_position_atlas,
            transformed_cells_section,
            cell_pop_labels,
        ) = output

        labeled_cells = update_labeled_cells(
            labeled_cells,
            z_position_atlas,
            transformed_cells_section,
            cell_pop_labels,
        )

        transformed_cells = add_2D_points_to_3D_array(
            transformed_cells_section, z_position_atlas, transformed_cells
        )

    return (
        transformed_cells,
        labeled_cells,
    )
