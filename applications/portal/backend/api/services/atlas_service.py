import json
import os

from api.constants import GridImages
from api.services.filesystem_service import create_dir
from workspaces.settings import ANNOTATIONS_PATH, CANAL_PATH, GRID_PATH, LAMINAS_PATH


def save_annotation_image(img, subdivision: str):
    return save_image(img, ANNOTATIONS_PATH, subdivision)


def save_canal_image(img, subdivision: str):
    return save_image(img, CANAL_PATH, subdivision)


def save_grid_images(frame_img, complete_img, subdivision: str):
    save_image(frame_img, os.path.join(GRID_PATH, GridImages.FRAME.value), subdivision)
    save_image(complete_img, os.path.join(GRID_PATH, GridImages.COMPLETE.value), subdivision)


def save_laminas_json(laminas_metadata: dict):
    with open(os.path.join(LAMINAS_PATH, "atlas_laminas.json"), "w") as f:
        json.dump(laminas_metadata, f)


def save_grid_metadata(metadata: dict):
    with open(os.path.join(GRID_PATH, "metadata.json"), "w") as f:
        json.dump(metadata, f)


def save_image(img, p: str, subdivision: str):
    create_dir(p)
    path = os.path.join(
        p,
        subdivision + ".png",
    )
    img.save(path)
