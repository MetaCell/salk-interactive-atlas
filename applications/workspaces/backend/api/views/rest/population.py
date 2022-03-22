import logging

from dry_rest_permissions.generics import DRYPermissions
from rest_framework import viewsets
from rest_framework.response import Response

from api.models import Population, Experiment
from api.serializers import PopulationSerializer

log = logging.getLogger("__name__")


class PopulationViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    permission_classes = (DRYPermissions,)
    serializer_class = PopulationSerializer
    queryset = Population.objects.all()

    def list(self, request, **kwargs):
        experiments = Experiment.objects.list_ids(request.user)
        queryset = Population.objects.filter(experiment__in=experiments)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
