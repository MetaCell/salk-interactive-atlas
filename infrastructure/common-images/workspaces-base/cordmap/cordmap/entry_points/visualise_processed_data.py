import fire
import napari

import numpy as np

from pathlib import Path

from cordmap.data.io import load_data
from cordmap.data.utils import filter_data_by_type


def visualise_processed_data(
    csv_file: str,
    cell_type_name: str = "OpenUpTriangle",
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    cord_outline_color: str = "magenta",
    white_matter_color: str = "cyan",
    cell_color: str = "white",
    point_size: int = 12,
    compress_z: bool = False,
):
    """
    Entry point to visualise a single, processed (i.e. outlines extracted)
    spinal cord image in napari.

    :param csv_file: Exported Data .csv file with cord outline, grey matter
    outline and cell positions.
    :param cell_type_name: Name of the cell feature type
    in the corresponding Key.csv
    :param cord_exterior_type_name: Name of the cord exterior feature type
    in the corresponding Key.csv
    :param grey_matter_type_name: Name of the grey matter boundary feature type
    in the corresponding Key.csv
    :param cord_outline_color: Colormap to render the grey matter. Run
    `napari.utils.colormaps.AVAILABLE_COLORMAPS` for a list.
    :param white_matter_color: Colormap to render the cord outline. Run
    `napari.utils.colormaps.AVAILABLE_COLORMAPS` for a list.
    :param cell_color: Colormap to render the cell positions. Run
    `napari.utils.colormaps.AVAILABLE_COLORMAPS` for a list.
    :param point_size: Radius of the rendered points (for cells, grey matter
    and cord outline)
    :param compress_z: If True, remove any z-spacing for easy 2D visualisation
    """

    data, metadata, max_y = load_data(Path(csv_file))

    if compress_z:
        z_positions = np.sort(np.unique(data["Z"]))
        z_spacing = z_positions[1] - z_positions[0]
        data["Z"] = data["Z"] / z_spacing

    data_by_type = filter_data_by_type(data, metadata)

    v = napari.Viewer()
    v.add_points(
        data_by_type[cord_exterior_type_name],
        name="Cord outline",
        face_color=white_matter_color,
        edge_color=white_matter_color,
        size=point_size,
    )
    v.add_points(
        data_by_type[grey_matter_type_name],
        name="Grey Matter",
        face_color=cord_outline_color,
        edge_color=cord_outline_color,
        size=point_size,
    )
    v.add_points(
        data_by_type[cell_type_name],
        name="Cells",
        face_color=cell_color,
        edge_color=cell_color,
        size=point_size,
    )
    napari.run()


def main():
    fire.Fire(visualise_processed_data)


if __name__ == "__main__":
    main()
