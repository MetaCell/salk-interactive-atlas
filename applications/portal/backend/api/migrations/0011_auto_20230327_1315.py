# Generated by Django 4.0.6 on 2023-03-27 13:15
import os

from django.db import migrations

from api.models import Population


def move_population_files(apps, schema_editor):
    for population in Population.objects.all():
        if population.cells:
            old_path = population.cells.path
            # get the current filename
            filename = os.path.basename(old_path)
            # get the new storage path
            new_path = os.path.join(population.storage_path, filename)
            # move the file to the new path
            os.rename(old_path, new_path)
            # update the file field to point to the new path
            population.cells.name = new_path
            population.save()


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0010_alter_collaborator_experiment_and_more'),
    ]

    operations = [
        migrations.RunPython(move_population_files),
    ]
