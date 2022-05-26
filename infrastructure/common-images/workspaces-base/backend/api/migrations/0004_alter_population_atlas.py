# Generated by Django 3.2.11 on 2022-04-21 07:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_population_opacity"),
    ]

    operations = [
        migrations.AlterField(
            model_name="population",
            name="atlas",
            field=models.CharField(
                choices=[
                    ("salk_cord_10um", "Salk cord 10um"),
                    ("allen_cord_20um", "Allen cord 20um"),
                ],
                default="salk_cord_10um",
                max_length=100,
            ),
        ),
    ]