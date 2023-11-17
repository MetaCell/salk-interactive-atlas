import logging

from django.http import Http404, HttpResponse, FileResponse
from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.schemas.openapi import AutoSchema

from api.constants import PopulationPersistentFiles
from api.models import Population, Pdf, Experiment
from api.serializers import PdfSerializer
from api.services.population_service import get_cells
from api.utils import send_file
from rest_framework.parsers import MultiPartParser, JSONParser
import os

log = logging.getLogger("__name__")


class PDFViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    permission_classes = (DRYPermissions,)
    serializer_class = PdfSerializer
    queryset = Pdf.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        population_obj = instance.population

        is_owner_of_experiment = Experiment.objects.my_experiments(request.user).filter(
            id=population_obj.experiment.id
        ).exists()
        if (not is_owner_of_experiment):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        population_storage_path = population_obj.storage_path
        pdf_storage_path = os.path.join(population_storage_path, 'pdf', instance.category, str(instance.id))
        if os.path.exists(pdf_storage_path):
            os.rmdir(pdf_storage_path)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
