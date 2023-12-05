import logging

from django.http import Http404, HttpResponse, FileResponse
from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.schemas.openapi import AutoSchema

from api.constants import PopulationPersistentFiles
from api.models import Experiment, Population, Pdf
from api.serializers import PopulationSerializer
from api.services.population_service import get_cells,  has_correct_at_sign_count
from api.services.user_service import is_user_owner
from api.utils import send_file

log = logging.getLogger("__name__")


class CustomPopulationSchema(AutoSchema):
    def get_operation(self, path, method):
        # Get the default operation object
        operation = super().get_operation(path, method)

        if method.lower() == 'get' and path == '/api/population/{id}/':
            # Add the experiment_id query parameter for the retrieve action
            params = operation.get('parameters', [])
            params.append({
                'name': 'experiment_id',
                'in': 'query',
                'required': False,
                'description': 'Optional experiment ID to filter PDFs',
                'schema': {
                    'type': 'integer',
                },
            })
            operation['parameters'] = params

        return operation

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

    def retrieve(self, request, *args, **kwargs):
        population = self.get_object()
        experiment_id = request.query_params.get('experiment_id')

        if experiment_id:
            try:
                experiment = Experiment.objects.get(id=experiment_id)
                # Check if experiment is not private or if the user is the owner
                if not experiment.is_private or experiment.owner == request.user:
                    # Filter PDFs based on both population and experiment_id
                    pdfs = Pdf.objects.filter(population=population, experiment_id=experiment_id)
                    # Update the population object's pdfs attribute
                    population.pdfs = pdfs
            except Experiment.DoesNotExist:
                pass

        serializer = self.get_serializer(population)
        return Response(serializer.data)

    def list(self, request, **kwargs):
        experiments = Experiment.objects.list_ids(request.user)
        queryset = Population.objects.filter(experiment__in=experiments)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_population_name = request.data.get("name")
        if ((new_population_name is None) or (not has_correct_at_sign_count(new_population_name))):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if (not is_user_owner(request, instance)):
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

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

