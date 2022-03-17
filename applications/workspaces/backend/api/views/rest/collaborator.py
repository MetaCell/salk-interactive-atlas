import logging
from rest_framework import viewsets
from rest_framework.response import Response
from dry_rest_permissions.generics import DRYPermissions
from api.models import Collaborator, Experiment
from api.serializers import CollaboratorSerializer


log = logging.getLogger("__name__")


class CollaboratorViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    permission_classes = (DRYPermissions,)
    serializer_class = CollaboratorSerializer
    queryset = Collaborator.objects.all()

    def list(self, request, **kwargs):
        experiments = Experiment.objects.list_ids(request.user)
        queryset = Collaborator.objects.filter(experiment__in=experiments).union(
            Collaborator.objects.filter(user=request.user)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
