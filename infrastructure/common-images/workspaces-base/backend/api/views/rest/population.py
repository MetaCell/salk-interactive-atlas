import logging

import numpy as np
from django.http import HttpResponse, Http404
from dry_rest_permissions.generics import DRYPermissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

from api.constants import PopulationPersistentFiles
from api.helpers.atlas import get_bg_atlas
from api.helpers.density_map.centroids_creator import CentroidsCreator
from api.helpers.density_map.iimage_creator import IImageCreator
from api.helpers.density_map.probability_map_creator import ProbabilityMapCreator
from api.helpers.exceptions import DensityMapIncorrectSubdivisionError
from api.models import Experiment, Population
from api.serializers import PopulationSerializer
from api.services.population_service import get_cells
from api.utils import send_file
from api.validators.density_map import validate_subdivision

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

    @action(detail=True)
    def cells(self, request, **kwargs):
        instance = self.get_object()
        try:
            return send_file(instance.cells.file)
        except ValueError:
            # there is no file yet associated with the population --> return not found 404
            raise Http404

    @action(detail=True, url_path='probability_map/(?P<subdivision>[^/.]+)', url_name='probability_map')
    def probability_map(self, request, **kwargs):
        return self._handle_get_image_request(PopulationPersistentFiles.PROBABILITY_MAP_IMG, request, **kwargs)

    @action(detail=True, url_path='centroids/(?P<subdivision>[^/.]+)', url_name='centroids')
    def centroids(self, request, **kwargs):
        return self._handle_get_image_request(PopulationPersistentFiles.CENTROIDS_IMG, request, **kwargs)

    def _handle_get_image_request(self, content, request, **kwargs):
        instance = self.get_object()
        subdivision = kwargs.get('subdivision')
        bg_atlas = get_bg_atlas(instance.atlas)
        try:
            validate_subdivision(bg_atlas, subdivision)
        except DensityMapIncorrectSubdivisionError:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

        cells = np.array(get_cells(subdivision, [instance]))
        if len(cells) == 0:
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)

        img = instance.get_image(subdivision, content)
        response = HttpResponse(content_type="image/png", status=status.HTTP_200_OK)
        img.save(response, "PNG")
        return response

