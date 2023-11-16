from django.core.management.base import BaseCommand

from api.management.utilities import create_populations_and_register_experiment
from api.services.cordmap_service import is_a_population_single_file, get_populations, \
    SINGLE_FILE_POPULATION_ID_COLUMN


class Command(BaseCommand):
    help = "Registers all populations for the given experiment using a fiducial approach"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=int)
        parser.add_argument("filepath", type=str)

    def handle(self, *args, **options):
        experiment_id = options["experiment_id"]
        filepath = options["filepath"]

        population_names = get_populations(filepath, is_a_population_single_file, SINGLE_FILE_POPULATION_ID_COLUMN)
        create_populations_and_register_experiment(filepath, experiment_id, population_names, True)
