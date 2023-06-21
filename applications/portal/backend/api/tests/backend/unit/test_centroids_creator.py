import csv
import unittest

import numpy as np

from api.helpers.atlas import get_bg_atlas
from api.helpers.density_map.centroids_creator import CentroidsCreator


def _get_cells(filepath):
    cells = []
    with open(filepath) as cells_file:
        reader = csv.reader(cells_file)
        for row in reader:
            cells.append([float(c) for c in row])
    return np.array(cells)


class TestUtils(unittest.TestCase):
    def test_centroids_creator(self):
        """
        Tests if no exception is raised
        """
        bg_atlas = get_bg_atlas('salk_cord_10um')
        cells = _get_cells('./api/tests/assets/C5-Rostral.csv')
        img = CentroidsCreator().create(bg_atlas, 'C5-Rostral', cells)
        img.save('./test.png')


if __name__ == "__main__":
    unittest.main()
