import codecs
import csv
import logging
import os
from pathlib import PosixPath

from workspaces.settings import PERSISTENT_ROOT

MARKER_LABELS = [
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "L8",
    "L9",
]

IGNORE_SET = [
    "Contour Name 1",
    "Grey",
    "FilledStar",
    "Keep",
    "Asterisk",
    "CCRemove",
    "Remove",
    "Ignore",
]

SINGLE_FILE_POPULATION_ID_COLUMN = "point"
MULTIPLE_FILE_POPULATION_ID_COLUMN = "isPoint"
MULTIPLE_FILE_POPULATION_NAME_COLUMN = "objectNames"


# This method is based on cordmap's get_populations_from_file
def is_a_population_multiple_files(row):
    if int(row[MULTIPLE_FILE_POPULATION_ID_COLUMN]) == 1:
        name = row[MULTIPLE_FILE_POPULATION_NAME_COLUMN]
        if name not in IGNORE_SET:
            return True
    return False


# This method is based on cordmap's get_population_labels_from_file
def is_a_population_single_file(row):
    name = row[SINGLE_FILE_POPULATION_ID_COLUMN]
    if name not in MARKER_LABELS:
        return True
    return None


def get_populations(filepath, is_population, name_key):
    path = os.path.join(PERSISTENT_ROOT, filepath)
    populations = set()
    with codecs.open(path, "r", encoding="utf-8-sig") as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            if is_population(row):
                populations.add(row[name_key])
    if '' in populations:
        logging.warning(f"Nameless population found on: {filepath}")
        populations.remove('')
    return populations
