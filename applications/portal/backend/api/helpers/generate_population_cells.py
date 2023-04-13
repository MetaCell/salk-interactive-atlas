import os.path
import uuid

from api.helpers.population_registration.ipopulation_registration_strategy import PopulationRegistrationStrategy
from api.services.filesystem_service import move_file

OUTPUT_DIRECTORY = "./out"


def get_cells_filepath(population_name: str, data_filepath: str, storage_path: str, strategy: PopulationRegistrationStrategy):
    out_dir = os.path.join(os.path.dirname(data_filepath), OUTPUT_DIRECTORY)
    csv_suffix = strategy.get_csv_suffix()
    strategy.register(data_filepath, out_dir)

    filepath = move_file(
        os.path.join(out_dir, f"{csv_suffix}_{population_name}.csv"),
        storage_path,
        f"{csv_suffix}_{str(uuid.uuid4())[:8]}.csv",
    )
    return filepath
