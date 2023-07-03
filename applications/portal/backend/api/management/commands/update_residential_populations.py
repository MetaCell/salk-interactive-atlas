from django.core import management
from django.core.management.base import BaseCommand
import os


class Command(BaseCommand):
    help = 'Updates multiple populations with respective .csv files'

    def handle(self, *args, **options):
        populations_and_files = [
            (1, 'V1.csv'),
            (2, 'V2a.csv'),
            (3, 'V2b.csv'),
            (4, 'V3.csv')
        ]

        for population_id, csv_file in populations_and_files:
            csv_file_path = os.path.join('api', 'management', 'assets', csv_file)
            management.call_command('update_population_cells', population_id, csv_file_path)
