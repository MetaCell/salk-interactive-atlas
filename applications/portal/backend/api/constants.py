from enum import Enum

ROSTRAL = "Rostral"
CAUDAL = "Caudal"


class PopulationPersistentFiles(Enum):
    CSV_FILE = ".csv"
    CONTOUR_PLOT_IMG = "_contour_plot.png"
    CONTOUR_PLOT_WITH_OVERLAY_IMG = "_contour_plot_with_overlay.png"
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
