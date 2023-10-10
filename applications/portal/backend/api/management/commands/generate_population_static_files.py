from django.core.management.base import BaseCommand

from api.models import Population


class Command(BaseCommand):
    help = "Generates density map images (contours and centroids) and splits csv for each population provided"

    def add_arguments(self, parser):
        parser.add_argument("population_ids", nargs="+", type=int)

    def handle(self, *args, **options):
        for pop_id in options["population_ids"]:
            try:
                p = Population.objects.get(pk=pop_id)
            except Population.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f"{pop_id}  does not exist. Skipping")
                )
                continue
            try:
                p.generate_static_files()
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"{pop_id}: {e}. Skipped"))
        self.stdout.write(
            self.style.SUCCESS("Generate population static files finished")
        )
