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
from api.services.user_service import is_user_owner
from api.services.pdf_service import get_pdf_save_dir
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

        if (not is_user_owner(request, population_obj)):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        pdf_storage_path = get_pdf_save_dir(
            population_obj.storage_path, instance)
        if os.path.exists(pdf_storage_path):
            os.remove(pdf_storage_path)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
