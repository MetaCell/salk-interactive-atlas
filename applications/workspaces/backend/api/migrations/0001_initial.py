# Generated by Django 3.2.11 on 2022-03-22 08:21

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Collaborator",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[("v", "Viewer"), ("e", "Editor")],
                        default="v",
                        max_length=1,
                    ),
                ),
                ("shared_on", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Experiment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("is_private", models.BooleanField(default=True)),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                ("last_modified", models.DateTimeField(auto_now=True)),
                (
                    "collaborators",
                    models.ManyToManyField(
                        related_name="collaborators",
                        through="api.Collaborator",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Tag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=40, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name="UserDetail",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "notification_method",
                    models.CharField(
                        choices=[("email", "Email")], default="email", max_length=5
                    ),
                ),
                ("notify_on_new_share", models.BooleanField(default=False)),
                ("notify_on_new_team_invite", models.BooleanField(default=False)),
                ("notify_on_clone_my_experiment", models.BooleanField(default=False)),
                ("notify_on_news", models.BooleanField(default=False)),
                ("avatar", models.ImageField(upload_to="avatars")),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Population",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "atlas",
                    models.CharField(
                        choices=[
                            ("slk10", "Salk cord 10um"),
                            ("aln20", "Allen cord 20um"),
                        ],
                        default="slk10",
                        max_length=5,
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
                ("color", models.CharField(max_length=7)),
                ("cells", models.FileField(upload_to="populations")),
                (
                    "experiment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="api.experiment",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="experiment",
            name="tags",
            field=models.ManyToManyField(blank=True, to="api.Tag"),
        ),
        migrations.AddField(
            model_name="experiment",
            name="teams",
            field=models.ManyToManyField(blank=True, to="auth.Group"),
        ),
        migrations.AddField(
            model_name="collaborator",
            name="experiment",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.DO_NOTHING, to="api.experiment"
            ),
        ),
        migrations.AddField(
            model_name="collaborator",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.DO_NOTHING,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterUniqueTogether(
            name="collaborator",
            unique_together={("user", "experiment")},
        ),
    ]
