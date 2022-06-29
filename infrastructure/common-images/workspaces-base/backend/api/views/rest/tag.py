import logging

from rest_framework import mixins, permissions, viewsets

from api.models import Tag
from api.serializers import TagSerializer

log = logging.getLogger("__name__")


class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    This viewset automatically provides `list`
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
