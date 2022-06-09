import os
from django.conf import settings

from api.services.filesystem_service import create_dir

ANNOTATIONS_PATH = os.path.join(settings.PERSISTENT_ROOT, "annotations")


def save_annotation_image(img, subdivision):
    create_dir(ANNOTATIONS_PATH)
    path = os.path.join(ANNOTATIONS_PATH, subdivision + '.png', )
    img.save(path)
