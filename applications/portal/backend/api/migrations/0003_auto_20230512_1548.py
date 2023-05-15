# Generated by Django 4.2 on 2023-05-12 15:48

import os
from shutil import copy2

from django.conf import settings
from django.core.files import File
from django.db import migrations

from api.constants import POPULATIONS_DATA
from api.models import PopulationStatus

HERE = os.path.dirname(os.path.realpath(__file__))
COLORS = ["#0000FF", "#FF0000", "#00FF00", "#FFA500"]


def create_residential_populations(apps, schema_editor):
    Population = apps.get_model('api', 'Population')
    directory = os.path.join(HERE, '../../data/resident_populations')

    for index, filename in enumerate(os.listdir(directory)):
        with open(os.path.join(directory, filename), 'rb') as f:
            population = Population(
                name=filename,
                color=COLORS[index % len(COLORS)],
                opacity=1.0,
                is_fiducial=False,
                status=PopulationStatus.FINISHED
            )
            population.save()
            # TODO: Use population.storage_path instead if possible
            storage_path = os.path.join(settings.PERSISTENT_ROOT, POPULATIONS_DATA, str(population.id))
            os.makedirs(storage_path, exist_ok=True)
            copy2(f.name, storage_path)
            population.cells.name = os.path.join(storage_path, filename)
            population.save()


def delete_residential_populations(apps, schema_editor):
    Population = apps.get_model('api', 'Population')
    Population.objects.filter(experiment__isnull=True).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_alter_population_experiment'),
    ]

    operations = [
        migrations.RunPython(create_residential_populations, delete_residential_populations),
    ]
