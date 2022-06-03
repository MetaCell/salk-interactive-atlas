import logging

from dry_rest_permissions.generics import DRYPermissions
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from api.constants import CORDMAP_DATA
from api.helpers.exceptions import InvalidInputError
from api.services.filesystem_service import create_temp_dir, move_files
from api.models import Experiment
from api.serializers import (
    ExperimentFileUploadSerializer,
    ExperimentSerializer,
    TagSerializer,
)
from api.services.experiment_service import add_tag, delete_tag, upload_files

log = logging.getLogger("__name__")

DATA_INDEX = 1


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    permission_classes = (DRYPermissions,)
    queryset = Experiment.objects.all()
    parser_classes = (MultiPartParser,)
    custom_serializer_map = {
        "upload_files": ExperimentFileUploadSerializer,
        "add_tag": TagSerializer,
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
    def add_tag(self, request, pk):
        instance = self.get_object()
        tag_name = request.data.get("name")
        tag = add_tag(instance, tag_name)

        serializer = self.get_serializer(tag)
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
        name="experiment-upload-file",
        url_path="upload-files",
    )
    def upload_files(self, request, **kwargs):
        instance = self.get_object()
        key_file = request.FILES.get("key_file")
        data_file = request.FILES.get("data_file")
        population_id = request.FILES.get("population_id", None)
        try:
            dir_path = create_temp_dir(CORDMAP_DATA)
            filepaths = move_files([key_file, data_file], dir_path)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            created = upload_files(instance, filepaths[DATA_INDEX], population_id)
            response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        except InvalidInputError:
            response_status = status.HTTP_400_BAD_REQUEST
        return Response(status=response_status)

    def perform_create(self, serializer):
        experiment = serializer.save(
            owner=self.request.user,
        )
