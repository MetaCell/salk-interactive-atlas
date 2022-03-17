from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class NotificationMethodsChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(
            v for v in list(NotificationMethodsChoice) if v.value == value
        ).label

    EMAIL = "email", "Email"


class UserDetail(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    notification_method = models.CharField(
        max_length=5,
        choices=NotificationMethodsChoice.choices,
        default=NotificationMethodsChoice.EMAIL,
    )
    notify_on_new_share = models.BooleanField(default=False)
    notify_on_new_team_invite = models.BooleanField(default=False)
    notify_on_clone_my_experiment = models.BooleanField(default=False)
    notify_on_news = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to="avatars")

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
