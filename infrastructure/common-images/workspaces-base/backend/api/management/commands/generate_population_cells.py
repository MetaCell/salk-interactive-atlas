import os

from django.core.management.base import BaseCommand

from api.services.filesystem_service import remove_dir
from api.models import Population
from workspaces.settings import PERSISTENT_ROOT


class Command(BaseCommand):
    help = "Generates the cells content for the population provided"

    def add_arguments(self, parser):
        parser.add_argument("population_id", type=int)
        parser.add_argument("data_filepath", type=str)

    def handle(self, *args, **options):
        path = os.path.join(PERSISTENT_ROOT, options['data_filepath'])
        try:
            p = Population.objects.get(pk=options["population_id"])
            p.generate_cells(path)
        except Population.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(f"{options['population_id']}  does not exist")
            )
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"{options['population_id']}: {e}."))

        remove_dir(os.path.dirname(path))
        self.stdout.write(self.style.SUCCESS("Generate population cells finished successfully"))
