# Generated by Django 3.2.11 on 2022-05-20 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_auto_20220519_0957"),
    ]

    operations = [
        migrations.AddField(
            model_name="population",
            name="status",
            field=models.IntegerField(
                choices=[(-1, "Error"), (0, "Running"), (1, "Ready")], default=1
            ),
            preserve_default=False,
        ),

    ]
