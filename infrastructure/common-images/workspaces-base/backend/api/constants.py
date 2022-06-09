from enum import Enum

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


class PopulationPersistentFiles(Enum):
    CSV_FILE = '.csv'
    PROBABILITY_MAP_IMG = '_probability_map.png'
    CENTROIDS_IMG = '_centroids.png'


CORDMAP_DATA = "cordmap_data"
POPULATIONS_DATA = 'populations'
POPULATIONS_SPLIT_DATA = 'split'
