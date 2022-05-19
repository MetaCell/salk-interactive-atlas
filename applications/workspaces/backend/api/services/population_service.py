import bisect
import csv

import numpy as np

from api.constants import PopulationPersistentFiles
from api.helpers.atlas import get_subdivision_boundaries, get_bg_atlas, get_subdivisions
from api.helpers.density_map.centroids_creator import CentroidsCreator
from api.helpers.density_map.iimage_creator import IImageCreator
from api.helpers.density_map.probability_map_creator import ProbabilityMapCreator


def split_cells_per_segment(population):
    population.remove_split_cells_csv()
    breakpoints, subdivisions = get_subdivision_boundaries(get_bg_atlas(population.atlas))
    get_cell_segment = lambda depth: _boundaries(breakpoints, subdivisions, depth)

    population.create_dir()

    file_writer_dict = {}
    try:
        for s in subdivisions:
            file = open(population.get_subdivision_path(s, PopulationPersistentFiles.CSV_FILE), "w")
            writer = csv.writer(file)
            file_writer_dict[s] = {"file": file, "writer": writer}
        with open(population.cells.path) as cells_file:
            reader = csv.reader(cells_file)
            for row in reader:
                cell_depth = float(row[0])
                subdivision = get_cell_segment(cell_depth)
                file_writer_dict[subdivision]["writer"].writerow(row)
    except Exception:
        pass
    finally:
        for r in file_writer_dict:
            file_writer_dict[r]["file"].close()


def get_cells(subdivision, populations):
    cells = []
    for pop in populations:
        with open(pop.get_subdivision_path(subdivision, PopulationPersistentFiles.CSV_FILE)) as cells_file:
            reader = csv.reader(cells_file)
            for row in reader:
                cells.append([float(c) for c in row])
    return cells


def _boundaries(breakpoints, subdivisions, depth):
    """
    Given the atlas subdivision limits (@breakpoints) and the subdivision names (@subdivisions)
    We can use the current method to know the name of the subdivision at a given @depth
    f.e:
    breakpoints [30, 44, 66, 75, 85]
    subdivisions [C1, C2, C3, C4, C5]
    would be equivalent to:
    If         grade < 30 then C1
    If   30 <= grade < 44 then C2
    If   44 <= grade < 66 then C3
    If   66 <= grade < 75 then C4
    If   75 <= grade < 85 then C5
    """
    i = bisect.bisect(breakpoints, depth - 1)
    return subdivisions[i]


def generate_images(population):
    bg_atlas = get_bg_atlas(population.atlas)
    subdivisions = get_subdivisions(bg_atlas)
    for s in subdivisions:
        cells = np.array(get_cells(s, [population]))
        _store_image(CentroidsCreator(), PopulationPersistentFiles.CENTROIDS_IMG, bg_atlas, cells, population, s)
        _store_image(ProbabilityMapCreator(), PopulationPersistentFiles.PROBABILITY_MAP_IMG, bg_atlas, cells, population, s)


def _store_image(creator: IImageCreator, extension: PopulationPersistentFiles, bg_atlas, cells, population, s, ):
    img = creator.get_image(bg_atlas=bg_atlas, subdivision=s, points=cells)
    img.save(population.get_subdivision_path(s, extension))

