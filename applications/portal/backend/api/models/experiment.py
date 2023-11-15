import os

from django.apps import apps
from django.conf import settings
from django.contrib.auth.models import Group, User
from django.db import models

from .text_choices import PopulationStatus, CollaboratorRole
from .tag import Tag
from ..constants import EXPERIMENTS_DATA
from ..helpers.experiment_registration.experiment_registration_strategy_factory import \
    get_registration_strategy
from ..helpers.population_cells import associate_population_cells_file
from ..services.filesystem_service import create_dir_if_not_exists


# Create your models here.
class ExperimentsObjectsManager(models.Manager):
    def get_queryset(self, prefetch=True):
        if prefetch:
            return (
                super(ExperimentsObjectsManager, self)
                .get_queryset()
                .select_related(
                    "owner",
                )
                .prefetch_related("teams", "tags", "collaborators", "collaborators")
            )
        return super(ExperimentsObjectsManager, self).get_queryset()

    def my_experiments(self, user, prefetch=True):
        return self.get_queryset(prefetch).filter(owner=user)

    def team_experiments(self, user, prefetch=True):
        return (
            self.get_queryset(prefetch)
            .filter(teams__user=user)  # my teams experiments
            .distinct()
        )

    def collaborate_experiments(self, user, prefetch=True):
        return self.get_queryset(prefetch).filter(
            collaborators__collaborator__user=user  # my teams experiments
        )

    def public_experiments(self, prefetch=True):
        return self.get_queryset(prefetch).filter(
            is_private=False
        )  # all public experiments

    def list(self, user, prefetch=True):
        return self.get_queryset(prefetch).filter(id__in=self.list_ids(user))

    def list_ids(self, user):
        return (
            self.my_experiments(user, False)
            .only("id")
            .union(self.team_experiments(user, False).only("id"))
            .union(self.collaborate_experiments(user, False).only("id"))
            .union(self.public_experiments(False).only("id"))
        )


class Experiment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    is_private = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    teams = models.ManyToManyField(Group, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    collaborators = models.ManyToManyField(
        User, related_name="collaborators", through="Collaborator"
    )

    # objects = models.Manager()
    objects = ExperimentsObjectsManager()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        super(Experiment, self).save(force_insert, force_update, using, update_fields)
        create_dir_if_not_exists(self.storage_path)

    def register(self, filepath, populations):
        if not populations:
            return

        is_fiducial = populations[0].is_fiducial

        Population = apps.get_model('api', 'Population')
        # Set status of all provided populations to RUNNING
        Population.objects.filter(id__in=[pop.id for pop in populations]).update(status=PopulationStatus.RUNNING)
        try:
            strategy = get_registration_strategy(is_fiducial)
            # Perform the registration
            strategy.register(filepath, self.storage_path)

            csv_suffix = strategy.get_csv_suffix()

            # Associate the generated files with the populations and save them
            for population in populations:
                associate_population_cells_file(population, self.storage_path, csv_suffix)

        except Exception as e:
            print(e)
            for population in populations:
                population.status = PopulationStatus.ERROR
                population.save()

    @property
    def storage_path(self) -> str:
        return os.path.join(settings.PERSISTENT_ROOT, EXPERIMENTS_DATA, str(self.id))

    def __str__(self):
        return self.name

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_list_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        return True

    def has_object_read_permission(self, request):
        return not self.is_private or self.has_object_write_permission(request)

    def has_object_write_permission(self, request):
        return (
                self.owner == request.user
                or (
                        self.teams
                        and len(self.teams.filter(team__group__user=request.user)) > 0
                )
                or (
                        self.collaborators
                        and len(
                    self.collaborator_set.filter(
                        user=request.user.id, role=CollaboratorRole.EDITOR
                    )
                )
                        > 0
                )
        )

    @staticmethod
    def has_retrieve_density_map_permission(request):
        return True

    def has_object_retrieve_density_map_permission(self, request):
        return self.has_object_read_permission(request)
