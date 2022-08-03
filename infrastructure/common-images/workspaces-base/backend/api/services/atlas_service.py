import json
import os

from api.services.filesystem_service import create_dir
from workspaces.settings import LAMINAS_PATH, CANAL_PATH, ANNOTATIONS_PATH, GRID_PATH


def save_annotation_image(img, subdivision: str):
    return save_image(img, ANNOTATIONS_PATH, subdivision)


def save_canal_image(img, subdivision: str):
    return save_image(img, CANAL_PATH, subdivision)


def save_grid_image(img, subdivision: str):
    return save_image(img, GRID_PATH, subdivision)


def save_laminas_json(laminas_metadata: dict):
    with open(os.path.join(LAMINAS_PATH, "atlas_laminas.json"), "w") as f:
        json.dump(laminas_metadata, f)


def save_image(img, p: str, subdivision: str):
    create_dir(p)
    path = os.path.join(p, subdivision + '.png', )
    img.save(path)
