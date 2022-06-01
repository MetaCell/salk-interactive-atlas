import os.path
import shutil
from pathlib import Path
import uuid
from typing import List

from django.core.files.uploadedfile import TemporaryUploadedFile

from workspaces.settings import PERSISTENT_ROOT


def remove_dir(dir_path: str):
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        pass


def create_dir(dir_path: str):
    Path(dir_path).mkdir(parents=True, exist_ok=True)


def create_temp_dir(parent_name: str) -> str:
    filename = str(str(uuid.uuid4())[:8])
    path = os.path.join(PERSISTENT_ROOT, parent_name, filename)
    create_dir(path)
    return path


def move_files(files: List[TemporaryUploadedFile], target_dir: str) -> List[str]:
    filepaths = []
    for file in files:
        filepaths.append(move_file(file.file.name, target_dir, file.name))
    return filepaths


def move_file(filepath, target_dir, filename=None) -> str:
    create_dir(target_dir)
    if not filename:
        filename = os.path.basename(filepath)
    dst_path = os.path.join(target_dir, filename)
    shutil.move(filepath, dst_path)
    return dst_path
