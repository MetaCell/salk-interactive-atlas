import os
from pathlib import PosixPath

from django.core.management.base import BaseCommand

from api.management.utilities import handle_populations_upload
from workspaces.settings import PERSISTENT_ROOT


class Command(BaseCommand):
    help = "Initializes the cells upload content for the populations provided"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=str)
        parser.add_argument("key_filepath", type=str)
        parser.add_argument("data_filepath", type=str)

    def handle(self, *args, **options):
        from cordmap.get_all_population_keys import get_populations_from_file
        from cordmap.register.constants import population_ignore_set

        key_filepath = PosixPath(os.path.join(PERSISTENT_ROOT, options["key_filepath"]))
        data_filepath = os.path.join(PERSISTENT_ROOT, options["data_filepath"])
        experiment_id = int(options["experiment_id"])

        handle_populations_upload(experiment_id,
                                  get_populations_from_file(key_filepath, population_ignore_set), data_filepath)

        self.style.SUCCESS("Cells upload operations launch successfully")
