import os
from pathlib import PosixPath

from django.core.management.base import BaseCommand

from api.models import Population
from api.services.workflows_service import create_custom_task, execute_generate_population_cells_workflow, \
    BASE_IMAGE
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

        populations = get_populations_from_file(key_filepath, population_ignore_set)
        tasks_list = []
        for name in populations:
            population = Population.objects.create(
                experiment_id=experiment_id, name=name
            )
            tasks_list.append(
                create_custom_task(BASE_IMAGE,
                                   command=["python", "manage.py", f"generate_population_cells", f"{population.id}",
                                            f"{data_filepath}", "false"]
                                   ))
        execute_generate_population_cells_workflow(tuple(tasks_list))
        self.style.SUCCESS("Cells upload operations launch successfully")
