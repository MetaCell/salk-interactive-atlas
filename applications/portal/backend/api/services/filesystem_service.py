import os.path
import shutil
from pathlib import Path
from typing import List

from django.core.files.uploadedfile import TemporaryUploadedFile

from api.utils import get_persistence_path


def remove_dir(dir_path: str):
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        pass


def create_dir_if_not_exists(dir_path: str):
    Path(dir_path).mkdir(parents=True, exist_ok=True)


def move_files(files: List[TemporaryUploadedFile], target_dir: str) -> List[str]:
    filepaths = []
    for file in files:
        filepaths.append(move_file(file.file.name, target_dir, file.name))
    return filepaths


def move_file(filepath, target_dir, filename=None) -> str:
    create_dir_if_not_exists(target_dir)
    if not filename:
        filename = os.path.basename(filepath)
    dst_path = os.path.join(target_dir, filename)
    shutil.move(filepath, dst_path)
    return get_persistence_path(dst_path)


def remove_file_if_exists(path: str):
    if os.path.exists(path):
        os.remove(path)
