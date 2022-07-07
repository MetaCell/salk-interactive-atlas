import json
import os

from api.constants import ANNOTATIONS_PATH, CANAL_PATH, LAMINAS_PATH
from api.services.filesystem_service import create_dir


def save_annotation_image(img, subdivision: str):
    return save_image(img, ANNOTATIONS_PATH, subdivision)


def save_canal_image(img, subdivision: str):
    return save_image(img, CANAL_PATH, subdivision)


def save_laminas_json(laminas_metadata: dict):
    with open(os.path.join(LAMINAS_PATH, "atlas_laminas.json"), "w") as f:
        json.dump(laminas_metadata, f)


def save_image(img, p: str, subdivision: str):
    create_dir(p)
    path = os.path.join(p, subdivision + '.png', )
    img.save(path)
