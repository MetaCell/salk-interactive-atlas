import logging

from django.http import Http404, HttpResponse, FileResponse
from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.schemas.openapi import AutoSchema

from api.constants import PopulationPersistentFiles
from api.models import Experiment, Population, Pdf, PDFCategory
from api.serializers import PopulationSerializer, PopulationPDFUploadSerializer, PdfSerializer
from api.services.population_service import get_cells
from api.services.user_service import is_user_owner
from api.services.pdf_service import convert_and_save_pdf_to_png
from api.utils import send_file
from api.helpers.exceptions import UserNotFoundInExperimentError, InvalidPDFFile
from rest_framework.parsers import MultiPartParser, JSONParser

log = logging.getLogger("__name__")


class CustomPopulationSchema(AutoSchema):
    def get_responses(self, path, method):
        view = self.view

        if hasattr(view, 'action') and view.action == 'residential':
            return {
                '200': {
                    'content': {
                        'application/json': {
                            'schema': {
                                'type': 'array',
                                'items': {
                                    '$ref': '#/components/schemas/Population'
                                }
                            }
                        }
                    },
                    'description': "Successful retrieval of the residential populations",
                }
            }

        # For other actions, fall back to the default behavior.
        return super().get_responses(path, method)


class PopulationViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` actions.
    """

    permission_classes = (DRYPermissions,)
    serializer_class = PopulationSerializer
    queryset = Population.objects.all()
    schema = CustomPopulationSchema()


    def list(self, request, **kwargs):
        experiments = Experiment.objects.list_ids(request.user)
        queryset = Population.objects.filter(experiment__in=experiments)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def residential(self, request, **kwargs):
        queryset = Population.objects.filter(experiment__isnull=True)
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

    @action(
        detail=True,
        url_path="contour_plot/(?P<subdivision>[^/.]+)/(?P<type>base|heatmap)",
        url_name="contour_plot",
    )
    def contour_plot(self, request, **kwargs):
        file_type_map = {
            'base': PopulationPersistentFiles.CONTOUR_PLOT_IMG,
            'heatmap': PopulationPersistentFiles.CONTOUR_PLOT_WITH_OVERLAY_IMG,
        }
        try:
            file_type = file_type_map[kwargs.get('type')]
        except KeyError:
            return Response(
                {"detail": "Invalid 'type' value. Must be either 'base' or 'heatmap'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self._handle_get_image_request(
            file_type, request, **kwargs
        )

    @action(
        detail=True, url_path="centroids/(?P<subdivision>[^/.]+)", url_name="centroids"
    )
    def centroids(self, request, **kwargs):
        return self._handle_get_image_request(
            PopulationPersistentFiles.CENTROIDS_IMG, request, **kwargs
        )

    def _handle_get_image_request(self, content, request, **kwargs):
        instance = self.get_object()
        subdivision = kwargs.get("subdivision")

        cells = get_cells(subdivision, [instance])
        if len(cells) == 0:
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)

        # 2022-10-11 ZS: disabled this due to memory issues
        # ToDo: fix issues with memory
        # bg_atlas = get_bg_atlas(instance.atlas)
        # try:
        #     validate_subdivision(bg_atlas, subdivision)
        # except DensityMapIncorrectSubdivisionError:
        #     return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
        # except Exception as e:
        #     return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

        response = FileResponse(
            open(instance.get_image_path(subdivision, content), 'rb'),
            content_type="image/png"
        )
        return response

    @action(
        detail=True,
        methods=["post"],
        parser_classes=(MultiPartParser,),
        name="upload-pdf-files",
        url_path="upload-pdf-files",
        serializer_class=PopulationPDFUploadSerializer,
    )
    def upload_pdf_file(self, request, **kwargs):
        pdf_file = request.FILES.get("pdf_file")
        category = request.data.get("category")
        instance = self.get_object()

        if instance.experiment and (not is_user_owner(request, instance)):
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            pdf_obj = Pdf.objects.create(
                population=instance, created_by=request.user,
                category=category, name=pdf_file.name
            )
            pdf_path = convert_and_save_pdf_to_png(
                pdf_obj=pdf_obj,
                population_storage_path=instance.storage_path, pdf_file=pdf_file
            )
            pdf_obj.file = pdf_path
            pdf_obj.save()

            pdf_serializer = PdfSerializer(pdf_obj)
            return Response(pdf_serializer.data, status=status.HTTP_201_CREATED)
        except InvalidPDFFile as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
