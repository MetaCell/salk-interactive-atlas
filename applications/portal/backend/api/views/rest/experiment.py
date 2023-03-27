import logging
import os

from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.helpers.exceptions import InvalidInputError
from api.models import Experiment
from api.serializers import (
    ExperimentPairFileUploadSerializer,
    ExperimentSerializer,
    TagSerializer,
    TagsSerializer, ExperimentSingleFileUploadSerializer,
)
from api.services.experiment_service import add_tag, delete_tag, upload_pair_files, upload_single_file
from api.services.filesystem_service import move_files
from api.validators.upload_files import validate_input_files

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
            validate_input_files(key_file, data_file)
        except InvalidInputError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            filepaths = move_files([key_file, data_file], instance.storage_path)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            created = upload_pair_files(instance, filepaths[KEY_INDEX], filepaths[DATA_INDEX])
            response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        except InvalidInputError:
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
        if file is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            filepaths = move_files([file], instance.storage_path)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            created = upload_single_file(instance, filepaths[0])
            response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        except InvalidInputError:
            response_status = status.HTTP_400_BAD_REQUEST
        return Response(status=response_status)

    @action(detail=True, methods=['get'])
    def compressed_populations(self, request, pk=None):
        experiment = self.get_object()
        try:
            with open(experiment.zip_path, 'rb') as zip_file:
                data = zip_file.read()
        except FileNotFoundError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        response = Response(data, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{os.path.basename(experiment.zip_path)}"'
        return response

    def perform_create(self, serializer):
        experiment = serializer.save(owner=self.request.user)
