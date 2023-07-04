import os

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError

from api.models import Population


class Command(BaseCommand):
    help = 'Load .csv file and updates a Population entity'

    def add_arguments(self, parser):
        parser.add_argument('population_id', type=int, help='Indicates the ID of the population to update')
        parser.add_argument('csv_file', type=str, help='Indicates the path to the .csv file')

    def handle(self, *args, **options):
        population_id = options['population_id']
        csv_file_path = options['csv_file']

        # Check if .csv file exists
        if not os.path.isfile(csv_file_path):
            raise CommandError('The .csv file "%s" does not exist' % csv_file_path)

        try:
            population = Population.objects.get(id=population_id)
        except Population.DoesNotExist:
            raise CommandError('The Population with ID "%s" does not exist' % population_id)

        # Update Population's cells file
        with open(csv_file_path, 'rb') as csv_file:
            population.cells.delete(save=False)  # Delete the old file
            population.cells.save(os.path.basename(csv_file_path), ContentFile(csv_file.read()), save=False)

        # Save the population to trigger the workflows
        population.save()

        self.stdout.write(self.style.SUCCESS('Successfully updated Population entity from "%s"' % csv_file_path))
