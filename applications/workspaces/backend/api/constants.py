from enum import Enum

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


class PopulationPersistentFiles(Enum):
    CSV_FILE = '.csv'
    DENSITY_IMG = '_density.png'
    CENTROIDS_IMG = '_centroids.png'
