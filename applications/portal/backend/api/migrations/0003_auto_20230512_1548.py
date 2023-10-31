import os
import shutil

from django.conf import settings
from django.core.files import File
from django.db import migrations

from api.constants import POPULATIONS_DATA
from api.models import PopulationStatus, Population

HERE = os.path.dirname(os.path.realpath(__file__))
COLORS = ["#0000FF", "#FF0000", "#00FF00", "#FFA500"]
DATA_DIR = os.path.abspath(os.path.join(HERE, '../../data/residential_populations'))


def create_residential_populations(apps, schema_editor):

    for index, csv_file in enumerate(os.listdir(DATA_DIR)):
        if csv_file.endswith('.csv'):
            name, _ = os.path.splitext(csv_file)
            population = Population(
                name=name,
                color=COLORS[index % len(COLORS)],
                opacity=1.0,
                is_fiducial=False,
                status=PopulationStatus.RUNNING
            )

            population.save()

            # After the instance is created, assign the cells file and save again
            with open(os.path.join(DATA_DIR, csv_file), 'rb') as file:
                population.cells.save(csv_file, File(file), save=True)


def delete_residential_populations(apps, schema_editor):
    Population = apps.get_model('api', 'Population')
    Population.objects.filter(experiment__isnull=True).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_alter_population_cells'),
    ]

    operations = [
        migrations.RunPython(create_residential_populations, delete_residential_populations),
    ]
