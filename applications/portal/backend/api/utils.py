import math
import os
import re

from django.http import FileResponse

from workspaces.settings import PERSISTENT_ROOT
from typing import Tuple


def send_file(file):
    """
    Send a file through Django without loading the whole file into
    memory at once. The FileWrapper will turn the file object into an
    iterator for chunks of 8KB.
    """
    response = FileResponse(open(file.name, "rb"), content_type="text/plain")
    response["Content-Length"] = file.size
    response["Content-Disposition"] = 'attachment; filename="%s"' % os.path.basename(
        file.name
    )
    return response


def is_valid_hex_str(hex_str: str) -> bool:
    if hex_str is None:
        return False

    regex = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
    p = re.compile(regex)
    if re.search(p, hex_str):
        return True

    return False


def flat_map(f, lst):
    ys = []
    for e in lst:
        ys.extend(f(e))
    return ys

def has_property(obj, prop: str) -> bool:
    try:
        getattr(obj, prop)
    except Exception:
        return False
    return True


def get_closest_multiple(number: float, multiple_of: float) -> Tuple[int, float]:
    closest_integer = int(math.ceil(number / multiple_of))
    return closest_integer, closest_integer * multiple_of


def create_dir_if_not_exists(dir_path: str) -> bool:
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        return True
    return False