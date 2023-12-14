from django.core.management.base import BaseCommand

from api.models import Population
from api.services.population_service import generate_images


class Command(BaseCommand):
    help = "Updates density map images (contours and centroids) for all populations"

    def handle(self, *args, **options):
        populations = Population.objects.all()

        for p in populations:
            try:
                generate_images(p)
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"{p.pk}: {e}. Skipped"))
            self.stdout.write(self.style.SUCCESS('Successfully updated Population "%s"' % p.id))

        self.stdout.write(
            self.style.SUCCESS("Generate population static files finished")
        )
