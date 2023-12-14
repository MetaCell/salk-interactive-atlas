import napari


def visualise_results(
    annotation,
    transformed_cells,
    transformed_gm,
    transformed_cord,
    probability_map,
):
    viewer = napari.Viewer()
    viewer.add_labels(annotation)
    if probability_map is not None:
        viewer.add_image(
            probability_map,
            opacity=0.6,
            colormap="inferno",
        )
    viewer.add_points(
        transformed_cells,
        size=2,
        name="Warped cells",
    )
    viewer.add_points(
        transformed_gm,
        size=2,
        name="Warped GM boundary",
    )
    viewer.add_points(transformed_cord, size=2, name="Warped cord boundary")

    napari.run()
