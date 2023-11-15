
from django.core.management.base import BaseCommand

from api.management.utilities import create_populations_and_register_experiment
from api.services.cordmap_service import is_a_population_multiple_files, get_populations, \
    MULTIPLE_FILE_POPULATION_NAME_COLUMN


class Command(BaseCommand):
    help = "Registers all populations for the given experiment using a non_fiducial approach"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=int)
        parser.add_argument("key_file_path", type=str)
        parser.add_argument("data_file_path", type=str)

    def handle(self, *args, **options):
        experiment_id = options["experiment_id"]
        key_filepath = options["key_file_path"]
        data_filepath = options["data_file_path"]

        population_names = get_populations(key_filepath, is_a_population_multiple_files,
                                           MULTIPLE_FILE_POPULATION_NAME_COLUMN)
        create_populations_and_register_experiment(data_filepath, experiment_id, population_names, False)
