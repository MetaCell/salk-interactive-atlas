from api.helpers.experiment_registration.iexperiment_registration_strategy import ExperimentRegistrationStrategy

PAIR_CELLS_CSV_SUFFIX = "cells_with_labels"


class NonFiducialExperimentRegistrationStrategy(ExperimentRegistrationStrategy):

    def register(self, data_filepath: str, out_dir: str):
        from cordmap.main import register_sections_3D
        register_sections_3D(data_filepath, out_dir, parallel=True)

    def get_csv_suffix(self) -> str:
        return PAIR_CELLS_CSV_SUFFIX
