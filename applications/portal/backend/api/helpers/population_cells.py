import os.path
import uuid

from django.core.files import File

from api.models import PopulationStatus
from api.services.filesystem_service import move_file


def associate_population_cells_file(population, storage_path, csv_suffix):
    original_file_name = f"{csv_suffix}_{population.name}.csv"
    original_file_path = os.path.join(storage_path, original_file_name)
    if os.path.exists(original_file_path):
        # Randomize the file name and move it to the population's storage path
        new_file_name = f"{csv_suffix}_{str(uuid.uuid4())[:8]}.csv"
        new_file_path = move_file(
            original_file_path,
            os.path.join(population.storage_path, str(population.id)),
            new_file_name
        )
        with open(new_file_path, 'rb') as file:
            population.cells.save(new_file_name, File(file), save=True)
        population.status = PopulationStatus.FINISHED
        population.save()
    else:
        population.status = PopulationStatus.ERROR
        population.save()
