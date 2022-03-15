# Generated by Django 3.2.11 on 2022-03-14 21:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SalkUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Population',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('atlas', models.CharField(choices=[('sl10', 'Salk cord 10um'), ('al20', 'Allen cord 20um')], default='sl10', max_length=5)),
                ('name', models.CharField(max_length=100, unique=True)),
                ('color', models.CharField(max_length=7)),
                ('experiment', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.experiment')),
            ],
        ),
        migrations.CreateModel(
            name='Cell',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.DecimalField(decimal_places=2, max_digits=6)),
                ('y', models.DecimalField(decimal_places=2, max_digits=6)),
                ('z', models.DecimalField(decimal_places=2, max_digits=6)),
                ('population', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.population')),
            ],
        ),
        migrations.AddField(
            model_name='experiment',
            name='tags',
            field=models.ManyToManyField(blank=True, to='api.Tag'),
        ),
    ]