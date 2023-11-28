import logging

from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.response import Response

from api.models import Pdf
from api.serializers import PdfSerializer
from api.services.user_service import is_user_owner
from api.services.pdf_service import get_pdf_save_dir
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

        if population_obj.experiment and (not is_user_owner(request, population_obj)):
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        pdf_storage_path = get_pdf_save_dir(
            population_obj.storage_path, instance)
        if os.path.exists(pdf_storage_path):
            os.remove(pdf_storage_path)
        
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
