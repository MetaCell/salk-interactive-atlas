# Generated by Django 4.0.6 on 2023-04-12 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20230327_1355'),
    ]

    operations = [
        migrations.AddField(
            model_name='population',
            name='is_fiducial',
            field=models.BooleanField(default=False),
        )
    ]
