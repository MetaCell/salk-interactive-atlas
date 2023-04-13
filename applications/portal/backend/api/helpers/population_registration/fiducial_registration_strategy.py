from api.helpers.population_registration.ipopulation_registration_strategy import PopulationRegistrationStrategy

SINGLE_CELLS_CSV_SUFFIX = "transformed_cells"


class FiducialCellRegistrationStrategy(PopulationRegistrationStrategy):

    def register(self, data_filepath: str, out_dir: str):
        from cordmap.entry_points.register_3D_fiducial import register_3D_fiducial
        register_3D_fiducial(data_filepath, out_dir)

    def get_csv_suffix(self) -> str:
        return SINGLE_CELLS_CSV_SUFFIX
