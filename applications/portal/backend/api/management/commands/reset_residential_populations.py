import os
import shutil

from django.conf import settings
from django.core.management.base import BaseCommand

from api.constants import POPULATIONS_DATA
from api.models import Population, PopulationStatus

HERE = os.path.dirname(os.path.realpath(__file__))
COLORS = ["#0000FF", "#FF0000", "#00FF00", "#FFA500"]


class Command(BaseCommand):
    help = 'Delete existing and create new residential populations'

    def handle(self, *args, **options):
        # Delete existing residential populations
        for population in Population.objects.filter(experiment__isnull=True):
            population.delete()

        directory = os.path.join(HERE, '../../../data/residential_populations')

        for index, pop_dir in enumerate(os.listdir(directory)):
            pop_dir_path = os.path.join(directory, pop_dir)

            # Look for the CSV file in the directory
            csv_file = next((f for f in os.listdir(pop_dir_path) if f.endswith('.csv')), None)
            if not csv_file:
                continue  # If no CSV file is found, skip this directory

            name, _ = os.path.splitext(csv_file)
            population = Population(
                name=name,
                color=COLORS[index % len(COLORS)],
                opacity=1.0,
                is_fiducial=False,
                status=PopulationStatus.RUNNING
            )
            population.save()

            # Copy the entire contents of each population's local directory to the storage path
            storage_path = os.path.join(settings.PERSISTENT_ROOT, POPULATIONS_DATA, str(population.id))
            os.makedirs(storage_path, exist_ok=True)
            shutil.copytree(pop_dir_path, storage_path, dirs_exist_ok=True)

            population.cells.name = os.path.join(storage_path, csv_file)
            population.status = PopulationStatus.FINISHED
            population.save()
            self.stdout.write(self.style.SUCCESS('Successfully updated residential population "%s"' % population.id))


        self.stdout.write(self.style.SUCCESS('Successfully updated residential populations'))
