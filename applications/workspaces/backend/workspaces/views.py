import mimetypes
import os
from pathlib import Path

from django.conf import settings
from django.http import HttpResponseRedirect, FileResponse
from django.utils._os import safe_join
from django.shortcuts import render
from django.urls import reverse


def view_404(request, exception=None):
      return HttpResponseRedirect(reverse("index"))


def index(request, path=""):
    context = {}
    if path == "":
        path = "index.html"
    fullpath = Path(safe_join(settings.STATIC_ROOT, "www", path))
    content_type, encoding = mimetypes.guess_type(str(fullpath))
    content_type = content_type or "application/octet-stream"
    try:
        fullpath.open("rb")
    except FileNotFoundError:
        return index(request, "") # index.html
    return FileResponse(fullpath.open("rb"), content_type=content_type)
