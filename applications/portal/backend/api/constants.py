from enum import Enum

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


class PopulationPersistentFiles(Enum):
    CSV_FILE = ".csv"
    PROBABILITY_MAP_IMG = "_probability_map.png"
    CENTROIDS_IMG = "_centroids.png"


EXPERIMENTS_DATA = "experiments"
POPULATIONS_DATA = "populations"
POPULATIONS_SPLIT_DATA = "split"


class LaminasImages(Enum):
    FILLED = "filled"
    CONTOUR = "contour"
    DASHED = "dashed"


class GridImages(Enum):
    COMPLETE = "complete"
    FRAME = "frame"


FULLY_OPAQUE = 255
HALF_OPAQUE = 128

WHITE = 255
GREY = 128
DARK_GREY = 35
