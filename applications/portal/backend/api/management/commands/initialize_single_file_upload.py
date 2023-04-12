import os
from pathlib import PosixPath

from django.core.management.base import BaseCommand

from api.management.utilities import handle_populations_upload
from workspaces.settings import PERSISTENT_ROOT


class Command(BaseCommand):
    help = "Initializes the cells upload content for the populations provided"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=str)
        parser.add_argument("filepath", type=str)

    def handle(self, *args, **options):
        from cordmap.register_fiducial.io import get_population_labels_from_file

        filepath = PosixPath(os.path.join(PERSISTENT_ROOT, options["filepath"]))
        experiment_id = int(options["experiment_id"])

        handle_populations_upload(experiment_id, get_population_labels_from_file(filepath), filepath, is_fiducial=True)
        self.style.SUCCESS("Cells upload operations launch successfully")
