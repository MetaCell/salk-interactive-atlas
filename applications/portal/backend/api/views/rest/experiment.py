import logging
import os
import tempfile
import zipfile

from django.db.models import Q
from django.http import HttpResponse
from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from api.helpers.exceptions import InvalidPopulationFile, DuplicatedPopulationError, InvalidInputError
from api.models import Experiment, Population
from api.serializers import (
    ExperimentPairFileUploadSerializer,
    ExperimentSerializer,
    TagSerializer,
    TagsSerializer, ExperimentSingleFileUploadSerializer, DownloadPopulationsSerializer,
)
from api.services.cordmap_service import get_populations, is_a_population_single_file, SINGLE_FILE_POPULATION_ID_COLUMN, \
    is_a_population_multiple_files, MULTIPLE_FILE_POPULATION_NAME_COLUMN
from api.services.experiment_service import add_tag, delete_tag, handle_populations_upload
from api.services.filesystem_service import move_files
from api.validators.upload_files import validate_multiple_files_input, validate_single_file_input

log = logging.getLogger("__name__")

DATA_INDEX = 1
KEY_INDEX = 0


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    permission_classes = (DRYPermissions,)
    queryset = Experiment.objects.all()
    parser_classes = (MultiPartParser,)
    custom_serializer_map = {
        "upload_pair_files": ExperimentPairFileUploadSerializer,
        "upload_single_file": ExperimentSingleFileUploadSerializer,
        "add_tags": TagsSerializer,
        'download_populations': DownloadPopulationsSerializer,
    }

    def get_serializer_class(self):
        if self.action in self.custom_serializer_map.keys():
            return self.custom_serializer_map[self.action]
        return ExperimentSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def list(self, request, **kwargs):
        queryset = Experiment.objects.list(request.user)
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        serializer = self.get_serializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        pk = kwargs.get("pk")
        queryset = self.get_queryset()
        instance = get_object_or_404(queryset, pk=pk)
        if request.user==instance.owner:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


    @action(detail=False)
    def mine(self, request):
        queryset = Experiment.objects.my_experiments(request.user)
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def public(self, request):
        queryset = Experiment.objects.public_experiments()
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def myteams(self, request):
        queryset = Experiment.objects.team_experiments(request.user)
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def sharedwithme(self, request):
        queryset = Experiment.objects.collaborate_experiments(request.user)
        queryset = self.get_serializer_class().setup_eager_loading(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="tag", url_name="tag_add")
    def add_tags(self, request, pk):
        instance = self.get_object()
        tags_names = request.data.get("tags").split(",")
        tags = []
        for name in tags_names:
            tags.append(add_tag(instance, name, save=False))
        instance.save()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["delete"],
        url_path="tag/(?P<tag_name>[^/.]+)",
        url_name="tag_delete",
    )
    def delete_tag(self, request, tag_name, **kwargs):
        instance = self.get_object()
        tag_name = request.data.get("name")
        delete_tag(instance, tag_name)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=True,
        methods=["post"],
        parser_classes=(MultiPartParser,),
        name="experiment-upload-pair-files",
        url_path="upload-pair-files",
    )
    def upload_pair_files(self, request, **kwargs):
        instance = self.get_object()
        key_file = request.FILES.get("key_file")
        data_file = request.FILES.get("data_file")
        try:
            validate_multiple_files_input(key_file, data_file, instance.id)
        except InvalidInputError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except DuplicatedPopulationError as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_409_CONFLICT)
        except InvalidPopulationFile as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        try:
            filepaths = move_files([key_file, data_file], instance.storage_path)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            handle_populations_upload(instance.id,
                                      get_populations(filepaths[KEY_INDEX], is_a_population_multiple_files,
                                                      MULTIPLE_FILE_POPULATION_NAME_COLUMN),
                                      filepaths[DATA_INDEX],
                                      False)
            response_status = status.HTTP_201_CREATED
        except InvalidPopulationFile:
            response_status = status.HTTP_400_BAD_REQUEST
        return Response(status=response_status)

    @action(
        detail=True,
        methods=["post"],
        parser_classes=(MultiPartParser,),
        name="experiment-upload-single-file",
        url_path="upload-single-file",
    )
    def upload_single_file(self, request, **kwargs):
        instance = self.get_object()
        file = request.FILES.get("file")
        try:
            validate_single_file_input(file, instance.id)
        except InvalidInputError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except DuplicatedPopulationError as e:
            return Response(data={'detail': str(e)}, status=status.HTTP_409_CONFLICT)
        try:
            filepaths = move_files([file], instance.storage_path)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            handle_populations_upload(instance.id,
                                      get_populations(filepaths[KEY_INDEX], is_a_population_single_file,
                                                      SINGLE_FILE_POPULATION_ID_COLUMN),
                                      filepaths[KEY_INDEX],
                                      True)
            response_status = status.HTTP_201_CREATED
        except InvalidPopulationFile:
            response_status = status.HTTP_400_BAD_REQUEST
        return Response(status=response_status)

    @action(detail=True, methods=['get'], url_path='download_populations/(?P<active_populations>[^/.]+)')
    def download_populations(self, request, pk=None, active_populations=None):
        experiment = self.get_object()

        active_populations = active_populations.split(',')
        if not active_populations or len(active_populations) == 0:
            return Response(status=status.HTTP_204_NO_CONTENT)

        filename_prefix = f'{experiment.name}' if experiment else 'population'
        filename_suffix = 's' if len(active_populations) > 1 else ''
        with tempfile.TemporaryFile() as temp_file:
            with zipfile.ZipFile(temp_file, 'w') as zip_file:
                for population in Population.objects.filter(Q(experiment=experiment) | Q(experiment=None),
                                                            id__in=active_populations):
                    if population.cells:
                        zip_file.write(population.cells.path, arcname=os.path.basename(population.cells.path))
                        filename_prefix += f"_{population.name}"

            temp_file.seek(0)  # move the file pointer to the beginning of the file

            response = HttpResponse(temp_file.read(), content_type='application/octet-stream')
            response[
                'Content-Disposition'] = f'attachment; filename="{filename_prefix}_population{filename_suffix}.zip"'
            return response

    def perform_create(self, serializer):
        experiment = serializer.save(owner=self.request.user)
