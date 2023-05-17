import os
import shutil

from django.conf import settings
from django.db import migrations

from api.constants import POPULATIONS_DATA
from api.models import PopulationStatus

HERE = os.path.dirname(os.path.realpath(__file__))
COLORS = ["#0000FF", "#FF0000", "#00FF00", "#FFA500"]


def create_residential_populations(apps, schema_editor):
    Population = apps.get_model('api', 'Population')
    directory = os.path.join(HERE, '../../data/residential_populations')

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
        print(f"Created population {name}")


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
