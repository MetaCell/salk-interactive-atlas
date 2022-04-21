import os
import shutil


def remove_file(file_path):
    try:
        os.remove(file_path)
    except (IsADirectoryError, FileNotFoundError) as e:
        pass


def remove_dir(dir_path):
    try:
        shutil.rmtree(dir_path)
    except OSError as e:
        pass
