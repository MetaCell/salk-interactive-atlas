import os
import re

from django.http import FileResponse


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
