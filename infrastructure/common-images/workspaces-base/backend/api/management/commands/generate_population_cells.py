import os

from django.core.management.base import BaseCommand

from api.models import Population


class Command(BaseCommand):
    help = "Generates the cells content for the population provided"

    def add_arguments(self, parser):
        parser.add_argument("population_id", type=int)
        parser.add_argument("key_filepath", type=str)

    def handle(self, *args, **options):
        try:
            p = Population.objects.get(pk=options["population_id"])
        except Population.DoesNotExist:
            self.stdout.write(
                self.style.WARNING(f"{options['population_id']}  does not exist")
            )
            return
        try:
            filename = os.path.basename(options["key_filepath"])
            p.generate_cells(filename)
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"{options['population_id']}: {e}."))
            return
        self.stdout.write(self.style.SUCCESS("Generate population cells finished successfully"))
