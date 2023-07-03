import csv
import unittest

import numpy as np

from api.helpers.atlas import get_bg_atlas
from api.helpers.density_map.contour_plot_creator import ContourPlotCreator


def _get_cells(filepath):
    cells = []
    with open(filepath) as cells_file:
        reader = csv.reader(cells_file)
        for row in reader:
            cells.append([float(c) for c in row])
    return np.array(cells)


class TestUtils(unittest.TestCase):
    def test_contour_plot_creator(self):
        """
        Tests if no exception is raised
        """
        bg_atlas = get_bg_atlas('salk_cord_10um')
        cells = _get_cells('./api/tests/assets/C1-Rostral.csv')
        images_dict = ContourPlotCreator().create(bg_atlas, 'C1-Rostral', cells)
        for key in images_dict:
            img = images_dict[key]
            img.save(f'./api/tests/assets/{key}.png')


if __name__ == "__main__":
    unittest.main()
