import bisect
import csv
import os.path
from django.conf import settings
from api.helpers.atlas import get_subdivision_boundaries
from api.helpers.filesystem import remove_dir, create_dir


def split_cells_per_segment(population):
    breakpoints, subdivisions = get_subdivision_boundaries(population.atlas)
    get_cell_segment = lambda depth: _boundaries(breakpoints, subdivisions, depth)

    save_dir_path = _get_population_save_dir(population.id)
    create_dir(save_dir_path)

    file_writer_dict = {}
    for s in subdivisions:
        file = open(_get_population_subdivision_file_path(population.id, s), 'w')
        writer = csv.writer(file)
        file_writer_dict[s] = {'file': file, 'writer': writer}

    with open(population.cells.path) as cells_file:
        reader = csv.reader(cells_file)
        for row in reader:
            cell_depth = float(row[0])
            subdivision = get_cell_segment(cell_depth)
            file_writer_dict[subdivision]['writer'].writerow(row)

    for r in file_writer_dict:
        file_writer_dict[r]['file'].close()


def remove_split_cells_csv(population):
    save_dir_path = _get_population_save_dir(population.id)
    remove_dir(save_dir_path)


def get_cells(subdivision, populations_ids):
    cells = []
    for pop_id in populations_ids:
        population_subdivision_file_path = _get_population_subdivision_file_path(pop_id, subdivision)
        with open(population_subdivision_file_path) as cells_file:
            reader = csv.reader(cells_file)
            for row in reader:
                cells.append([float(c) for c in row])
    return cells


def _boundaries(breakpoints, subdivisions, depth):
    i = bisect.bisect(breakpoints, depth - 1)
    return subdivisions[i]


def _get_population_subdivision_file_path(population_id, subdivision):
    save_dir_path = _get_population_save_dir(population_id)
    return os.path.join(save_dir_path, subdivision + ".csv")


def _get_population_save_dir(population_id):
    return os.path.join(settings.PERSISTENT_ROOT, "populations", str(population_id))
