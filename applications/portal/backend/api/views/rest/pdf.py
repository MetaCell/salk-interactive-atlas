import logging
import os

from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response

from api.helpers.exceptions import InvalidPDFFile
from api.models import Pdf, Population, Experiment
from api.serializers import PdfSerializer
from api.services.pdf_service import get_pdf_save_dir, save_pdf_and_get_path

log = logging.getLogger("__name__")


class PDFViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    permission_classes = (DRYPermissions,)
    serializer_class = PdfSerializer
    queryset = Pdf.objects.all()
    parser_classes = (MultiPartParser, JSONParser)

    def partial_update(self, request, *args, **kwargs):
        # Disable PATCH
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        # Disable PUT
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        population = instance.population

        pdf_storage_path = get_pdf_save_dir(population.storage_path, instance)
        if os.path.exists(pdf_storage_path):
            os.remove(pdf_storage_path)

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, **kwargs):
        pdf_file = request.FILES.get("file")
        category = request.data.get("category")
        population_id = request.data.get("population")
        experiment_id = request.data.get("experiment")

        # Retrieve the Population and Experiment instances
        try:
            population = Population.objects.get(id=population_id)
            experiment = Experiment.objects.get(id=experiment_id)
        except (Population.DoesNotExist, Experiment.DoesNotExist):
            return Response(status=status.HTTP_404_NOT_FOUND)

        try:
            pdf_obj = Pdf.objects.create(
                population=population, experiment=experiment,
                created_by=request.user, category=category, name=pdf_file.name
            )

            pdf_path = save_pdf_and_get_path(
                pdf_obj=pdf_obj,
                population_storage_path=population.storage_path, pdf_file=pdf_file
            )
            pdf_obj.file = pdf_path
            pdf_obj.save()

            pdf_serializer = self.get_serializer(pdf_obj)
            return Response(pdf_serializer.data, status=status.HTTP_201_CREATED)
        except InvalidPDFFile as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
