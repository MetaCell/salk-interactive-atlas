from django.contrib.auth.models import Group, User
from django.db import models

from .collaborator_role import CollaboratorRole
from .tag import Tag


# Create your models here.
class ExperimentsObjectsManager(models.Manager):
    def get_queryset(self, prefetch=True):
        if prefetch:
            return super(ExperimentsObjectsManager, self).get_queryset().select_related("owner", ).prefetch_related("teams", "tags", "collaborators", "collaborators")
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
        return self.get_queryset(prefetch).filter(is_private=False)  # all public experiments

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
