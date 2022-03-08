# Generated by Django 3.2.11 on 2022-03-08 18:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collaborator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('v', 'Viewer'), ('e', 'Editor')], default='v', max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='Experiment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateField(auto_created=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('is_private', models.BooleanField(default=True)),
                ('last_modified', models.DateField(auto_now=True)),
                ('collaborators', models.ManyToManyField(related_name='collaborators', through='api.Collaborator', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('teams', models.ManyToManyField(blank=True, to='auth.Group')),
            ],
        ),
        migrations.AddField(
            model_name='collaborator',
            name='experiment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.experiment'),
        ),
        migrations.AddField(
            model_name='collaborator',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
    ]
