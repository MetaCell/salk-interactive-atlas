# Generated by Django 4.0.6 on 2023-03-27 13:55
import os

from django.db import migrations

from api.models import Experiment


def compress_populations(apps, schema_editor):
    for experiment in Experiment.objects.all():
        if not os.path.exists(experiment.zip_path):
            experiment.save()  # creates the experiment file if it doesn't exist


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0011_auto_20230327_1315'),
    ]

    operations = [
        migrations.RunPython(compress_populations),
    ]
