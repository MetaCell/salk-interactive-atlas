from distutils.util import strtobool

from django.core.management.base import BaseCommand
from django.db import transaction

from api.management.utilities import register_experiment
from api.models import Experiment, Population, PopulationStatus
from api.services.cordmap_service import is_a_population_single_file, is_a_population_multiple_files, get_populations, \
    SINGLE_FILE_POPULATION_ID_COLUMN, MULTIPLE_FILE_POPULATION_NAME_COLUMN


class Command(BaseCommand):
    help = "Registers all populations for the given experiment using a fiducial approach"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=int)
        parser.add_argument("filepath", type=str)

    def handle(self, *args, **options):
        experiment_id = options["experiment_id"]
        filepath = options["filepath"]

        population_names = get_populations(filepath, is_a_population_single_file, SINGLE_FILE_POPULATION_ID_COLUMN)
        register_experiment(filepath, experiment_id, population_names)
