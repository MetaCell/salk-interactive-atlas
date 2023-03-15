import os

from django.core.management.base import BaseCommand

from api.models import Population
from api.services.filesystem_service import remove_dir
from workspaces.settings import PERSISTENT_ROOT


def str2bool(v):
    return v.lower() in ("yes", "true", "t", "1")


class Command(BaseCommand):
    help = "Generates the cells content for the population provided"

    def add_arguments(self, parser):
        parser.add_argument("population_id", type=int)
        parser.add_argument("filepath", type=str)
        parser.add_argument("is_fiducial", type=str2bool)

    def handle(self, *args, **options):
        path = os.path.join(PERSISTENT_ROOT, options["filepath"])
        try:
            p = Population.objects.get(pk=options["population_id"])
            p.generate_cells(path, options.get("is_fiducial", False))
        except Population.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(f"{options['population_id']}  does not exist")
            )
        except Exception as e:
            # todo: verify if happens
            self.stdout.write(self.style.WARNING(f"{options['population_id']}: {e.__cause__}."))

        remove_dir(os.path.dirname(path))
        self.stdout.write(
            self.style.SUCCESS("Generate population cells finished successfully")
        )
