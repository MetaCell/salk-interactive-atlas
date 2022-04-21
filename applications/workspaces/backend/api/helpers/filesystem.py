import shutil
from pathlib import Path


def remove_dir(dir_path):
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        pass


def create_dir(dir_path):
    Path(dir_path).mkdir(parents=True, exist_ok=True)
