import os
from pathlib import PosixPath

import pandas as pd
from django.core.management.base import BaseCommand

from api.models import Population
from api.services.workflows_service import create_custom_task, execute_generate_population_cells_workflow, \
    BASE_IMAGE
from applications.portal.cordmap.cordmap.register_fiducial.io import MARKER_LABELS
from workspaces.settings import PERSISTENT_ROOT


def get_populations_from_file(filepath, ignore_set=None):
    if ignore_set is None:
        ignore_set = set()
    populations = []

    df = pd.read_csv(filepath)
    for population in set(df[~df["point"].isin(MARKER_LABELS)]["point"].dropna().values):
        if population not in ignore_set:
            populations.append(population)
    return populations


class Command(BaseCommand):
    help = "Initializes the cells upload content for the populations provided"

    def add_arguments(self, parser):
        parser.add_argument("experiment_id", type=str)
        parser.add_argument("filepath", type=str)

    def handle(self, *args, **options):

        filepath = PosixPath(os.path.join(PERSISTENT_ROOT, options["filepath"]))
        experiment_id = int(options["experiment_id"])

        populations = get_populations_from_file(filepath)
        tasks_list = []
        for name in populations:
            population = Population.objects.create(
                experiment_id=experiment_id, name=name
            )
            tasks_list.append(
                create_custom_task(BASE_IMAGE,
                                   command=["python", "manage.py", f"generate_population_cells", f"{population.id}",
                                            f"{filepath}", "true"]
                                   ))
        execute_generate_population_cells_workflow(tuple(tasks_list))
        self.style.SUCCESS("Cells upload operations launch successfully")
