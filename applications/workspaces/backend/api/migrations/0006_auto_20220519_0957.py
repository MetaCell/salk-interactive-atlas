# Generated by Django 3.2.11 on 2022-05-19 09:57

from django.db import migrations
from django.core.management import call_command

from api.models import Population


def generate_images(apps, schema_editor):
    ids =[str(pop.id) for pop in Population.objects.all()]
    if ids:
        call_command('generate_population_images', *ids)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20220428_1308'),
    ]

    operations = [
        migrations.RunPython(generate_images),
    ]

