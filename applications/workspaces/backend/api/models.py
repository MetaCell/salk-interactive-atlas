from enum import Enum

from django.db import models
from django.contrib.auth.models import Group, User


# Create your models here.

class NotificationMethodsChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    EMAIL = "email", "Email"

class UserDetail(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    notification_method = models.CharField(max_length=5, choices=NotificationMethodsChoice.choices, default=NotificationMethodsChoice.EMAIL)
    notify_on_new_share = models.BooleanField(default=False)
    notify_on_new_team_invite = models.BooleanField(default=False)
    notify_on_clone_my_experiment = models.BooleanField(default=False)
    notify_on_news = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars')

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        return True

    def has_object_read_permission(self, request):
        return self.user == request.user

    def has_object_write_permission(self, request):
        return self.user == request.user

class AtlasesChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    SLK10 = "sl10", "Salk cord 10um"
    ALN20 = "al20", "Allen cord 20um"


class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)

    @staticmethod
    def has_read_permission(request):
        return True

    @staticmethod
    def has_list_permission(request):
        return True

    @staticmethod
    def has_write_permission(request):
        return True

    def __str__(self):
        return f"{self.name}"


class CollaboratorRole(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(CollaboratorRole) if v.value == value).label

    VIEWER = "v", "Viewer"
    EDITOR = "e", "Editor"


class ExperimentsObjectsManager(models.Manager):
    def my_experiments(self, user):
        return self.get_queryset().filter(owner=user)

    def team_experiments(self, user):
        return (
            self.get_queryset()
                .filter(teams__user=user)  # my teams experiments
                .distinct()
        )

    def collaborate_experiments(self, user):
        return self.get_queryset().filter(
            collaborators__collaborator__user=user  # my teams experiments
        )

    def public_experiments(self):
        return self.get_queryset().filter(is_private=False)  # all public experiments

    def list(self, user):
        return self.my_experiments(user) \
            .union(self.team_experiments(user)) \
            .union(self.collaborate_experiments(user)) \
            .union(self.public_experiments())


class Experiment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    is_private = models.BooleanField(default=True)
    date_created = models.DateField(auto_created=True)
    last_modified = models.DateField(auto_now=True)
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


class Collaborator(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    role = models.CharField(
        max_length=1, choices=CollaboratorRole.choices, default=CollaboratorRole.VIEWER
    )

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}, {self.experiment} ({CollaboratorRole.to_str(self.role)})"


class Population(models.Model):
    experiment = models.ForeignKey(Experiment, on_delete=models.DO_NOTHING)
    atlas = models.CharField(max_length=5, choices=AtlasesChoice.choices, default=AtlasesChoice.SLK10)
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7)  # hex color


class Cell(models.Model):
    x = models.DecimalField(decimal_places=2, max_digits=6)
    y = models.DecimalField(decimal_places=2, max_digits=6)
    z = models.DecimalField(decimal_places=2, max_digits=6)
    population = models.ForeignKey(Population, on_delete=models.CASCADE)
