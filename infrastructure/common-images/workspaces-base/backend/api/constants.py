import os
from enum import Enum

from django.conf import settings

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


class PopulationPersistentFiles(Enum):
    CSV_FILE = '.csv'
    PROBABILITY_MAP_IMG = '_probability_map.png'
    CENTROIDS_IMG = '_centroids.png'


CORDMAP_DATA = "cordmap_data"
POPULATIONS_DATA = 'populations'
POPULATIONS_SPLIT_DATA = 'split'


class LaminasImages(Enum):
    FILLED = 'filled'
    CONTOUR = 'contour'
    DASHED = 'dashed'


WHITE = 255
GREY = 128
DARK_GREY = 35
