# Generated by Django 3.2.11 on 2022-04-28 13:08

from django.db import migrations

from api.models import Population, PopulationStatus
from api.services.workflows_service import execute_generate_population_static_files_workflow


def update_existent_populations(apps, schema_editor):
    for pop in Population.objects.all():
        execute_generate_population_static_files_workflow(pop.id)


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0007_population_status"),
    ]

    operations = [
        migrations.RunPython(update_existent_populations),
    ]