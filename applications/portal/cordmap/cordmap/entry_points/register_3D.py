import fire

from cordmap.main import register_sections_3D


def register_cord_section_3D(
    csv_file: str,
    output_directory: str,
    atlas: str = "salk_cord_10um",
    cord_exterior_type_name: str = "Contour Name 1",
    grey_matter_type_name: str = "Grey",
    debug: bool = False,
    visualise: bool = False,
    save: bool = True,
    save_csv: bool = True,
    save_npy: bool = True,
    parallel: bool = True,
    n_free_cpus: int = 2,
    atlas_limit: int = None,
    debug_slice_number: int = 5,
    subsample_points: int = 10,
    use_control_points: bool = False,
    image_metric_weight: float = 0.9,
    point_metric_weight: float = 0.1,
    use_cord_for_reg: bool = True,
    use_gm_for_reg: bool = True,
    prob_map: bool = False,
    save_prob_map: bool = True,
    mask_prob_map: bool = True,
    prob_map_normalise: bool = True,
    prob_map_smoothing: float = 50,
    population_upsampling_factor: int = 1,
):
    """
    Entry point to register a single cord image to a BrainGlobe atlas.

    :param csv_file: Exported Data .csv file with cord outline, grey matter
    outline and cell positions.
    :param output_directory: Directory to save the results
    :param atlas: Which BrainGlobe atlas to use. Run `brainglobe list` to see
    a list of available atlases.
    :param cell_type_name: Name of the cell feature type in the corresponding
    Key.csv file.
    :param cord_exterior_type_name: Name of the cord exterior feature type
    in the corresponding Key.csv
    :param grey_matter_type_name: Name of the grey matter boundary feature type
    in the corresponding Key.csv
    :param debug: Only run the analysis on part of the data, store
    intermediate files, and increase logging verbosity.
    :param visualise: Load the data into napari for visualisation at the end
    of registration.
    :param save: Save output files
    :param save_csv: Save output files as .csv
    :param save_npy: Save output files as .npy
    :param parallel: Process data in parallel for speed
    :param n_free_cpus: If using the parallel option, reserve this many CPU
    cores for other tasks
    :param atlas_limit: The axial limit of the atlas to use for visualisation
    (i.e. don't visualise the entire atlas)
    :param debug_slice_number: If using debug mode, how many sections to
    register
    :param subsample_points: Only process a subset of data for speed, at the
    expense of accuracy.
    :param use_control_points: Use control points for registration, in addition
    to the image-based registration.
    :param image_metric_weight: Weighting of the image-based registration
    metric
    :param point_metric_weight: Weighting of the control-point based
    registration metric
    :param use_cord_for_reg: Use the cord outline for registration
    :param use_gm_for_reg: Use the grey matter outline for registration
    :param prob_map: Generate  a probability map (cell per unit volume)
    :param save_prob_map: Save the probability map as tiff
    :param mask_prob_map: Mask the probability map, outside of the atlas
    :param prob_map_normalise: Normalise the probability map
    :param prob_map_smoothing: Smooth the probability map (in um)
    """

    register_sections_3D(
        csv_file,
        output_directory,
        atlas_name=atlas,
        cord_exterior_type_name=cord_exterior_type_name,
        grey_matter_type_name=grey_matter_type_name,
        debug=debug,
        visualise=visualise,
        save=save,
        save_csv=save_csv,
        save_npy=save_npy,
        parallel=parallel,
        n_free_cpus=n_free_cpus,
        atlas_limit=atlas_limit,
        debug_slice_number=debug_slice_number,
        subsample_points=subsample_points,
        use_control_points=use_control_points,
        image_metric_weight=image_metric_weight,
        point_metric_weight=point_metric_weight,
        use_cord_for_reg=use_cord_for_reg,
        use_gm_for_reg=use_gm_for_reg,
        prob_map=prob_map,
        save_prob_map=save_prob_map,
        mask_prob_map=mask_prob_map,
        prob_map_normalise=prob_map_normalise,
        prob_map_smoothing=prob_map_smoothing,
        population_upsampling_factor=population_upsampling_factor,
    )


def main():
    fire.Fire(register_cord_section_3D)


if __name__ == "__main__":
    main()
