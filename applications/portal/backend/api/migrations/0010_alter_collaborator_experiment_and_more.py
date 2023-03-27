# Generated by Django 4.0.6 on 2022-10-06 15:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_population_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collaborator',
            name='experiment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.experiment'),
        ),
        migrations.AlterField(
            model_name='population',
            name='experiment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.experiment'),
        ),
    ]
