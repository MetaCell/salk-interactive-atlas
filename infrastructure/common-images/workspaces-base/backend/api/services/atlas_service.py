import json
import os
from django.conf import settings

from api.helpers.ICustomAtlas import ICustomAtlas
from api.services.filesystem_service import create_dir

ANNOTATIONS_PATH = os.path.join(settings.PERSISTENT_ROOT, "annotations")
CANAL_PATH = os.path.join(settings.PERSISTENT_ROOT, "canal")
LAMINAS_PATH = os.path.join(settings.PERSISTENT_ROOT, "laminas")


def save_annotation_image(img, subdivision: str):
    return _save_image(img, ANNOTATIONS_PATH, subdivision)


def save_canal_image(img, subdivision: str):
    return _save_image(img, CANAL_PATH, subdivision)


def save_lamina_image(img, lamina_name: str, subdivision: str):
    return _save_image(img, os.path.join(LAMINAS_PATH, lamina_name), subdivision)


def save_laminas_json(bg_atlas: ICustomAtlas):
    #TODO: replace hardcoded with laminas = [lamina['acronym'] for lamina in bg_atlas.structures['laminas']]
    laminas = ['L1']
    with open(os.path.join(LAMINAS_PATH, "atlas_laminas.json"), "w") as f:
        json.dump(laminas, f)


def _save_image(img, p: str, subdivision: str):
    create_dir(p)
    path = os.path.join(p, subdivision + '.png', )
    img.save(path)
