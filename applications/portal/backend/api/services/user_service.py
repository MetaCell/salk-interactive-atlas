from rest_framework import status
from rest_framework.response import Response


def is_user_owner(request, instance):
    if instance.experiment.owner == request.user:
        return True
    return False