import shutil
from pathlib import Path


def remove_dir(dir_path: str):
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        pass


def create_dir(dir_path: str):
    Path(dir_path).mkdir(parents=True, exist_ok=True)
