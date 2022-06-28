import os
from django.conf import settings

from api.services.filesystem_service import create_dir

ANNOTATIONS_PATH = os.path.join(settings.PERSISTENT_ROOT, "annotations")
CANAL_PATH = os.path.join(settings.PERSISTENT_ROOT, "canal")


def save_annotation_image(img, subdivision):
    return _save_image(img, ANNOTATIONS_PATH, subdivision)


def save_canal_image(img, subdivision):
    return _save_image(img, CANAL_PATH, subdivision)


def _save_image(img, p, subdivision):
    create_dir(p)
    path = os.path.join(p, subdivision + '.png', )
    img.save(path)
