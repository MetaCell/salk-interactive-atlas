import matplotlib as mpl
import numpy as np
from matplotlib import pyplot as plt

from cordmap.postprocessing.prob_map import generate_prob_map


def get_average_cord(
    points_list, smoothing, atlas, output_directory, upsample_factor=1
):
    """

    :param points_list: A list of all coordinates (z, x, y) for all
    samples to be combined into an average probability map.
    :return:
    """
    avg_number_of_cells = int(np.mean([len(points) for points in points_list]))
    points_all_samples = np.concatenate(points_list)

    (
        coordinates,
        probability_map,
    ) = get_cell_coordinates_sampled_from_distribution(
        output_directory,
        points_all_samples,
        atlas,
        smoothing,
        avg_number_of_cells * upsample_factor,
    )
    return coordinates, probability_map


def get_coordinates_in_slice(points, z_position):
    return [c for c in points if c[0] == z_position]


def plot_section(slice_index, atlas, coordinates, probability_map, alpha=0.7):
    """
    This function plots a given z position. Overlay of atlas image,
    heatmap and coordinates of cell positions.

    :param slice_index:
    :param atlas:
    :param coordinates:
    :param probability_map:
    :param alpha:
    :return:
    """
    plt.imshow(atlas.annotation[slice_index], cmap=mpl.colormaps["Greys"])
    plt.imshow(probability_map[slice_index], alpha=alpha)
    coordinates_in_slice = get_coordinates_in_slice(coordinates, slice_index)
    print(len(coordinates_in_slice))
    for c in coordinates_in_slice:
        plt.plot(c[2], c[1], "o", color="k", markersize=2)


def get_cell_coordinates_sampled_from_distribution(
    output_directory,
    points_all_samples,
    atlas,
    smoothing,
    number_of_cells_in_cord,
):
    """
    This function takes a list of cell positions (z, x, y) and generates
    a distribution in 3D. This distribution is then used to draw N new
    coordinates across the entire 3D sample.

    :param output_directory:
    :param points_all_samples: a list of cell positions (z, x, y)
    :param atlas:
    :param smoothing: how much smoothing to apply to the distribution
    before drawing new cells
    :param number_of_cells_in_cord: number of new cells you want in
    the new "sample"
    :return:
    """
    probability_map = generate_prob_map(
        output_directory,
        points_all_samples,
        atlas,
        smoothing=smoothing,
        normalise=True,
        mask=True,
    )
    cdf = np.cumsum(probability_map)
    cdf /= cdf[-1]
    random_numbers = np.random.random_sample((number_of_cells_in_cord,))
    coordinates = np.zeros((number_of_cells_in_cord, 3), dtype=int)
    for i, rand_num in enumerate(random_numbers):
        index = np.searchsorted(cdf, rand_num)
        if index < len(cdf):
            z, y, x = np.unravel_index(index, probability_map.shape)
            coordinates[i] = z, y, x
    return coordinates, probability_map


def get_representative_population(
    sample_fpaths, smoothing, atlas, output_directory, upsample_factor=1
):
    """
    This function generates a representative sample of cell positions in
    3D from a list of file paths to the samples transformed_cells.npy files.

    :param sample_fpaths: paths to transformed_cells.npy files to include
    in representative population
    :param smoothing:
    :param atlas:
    :param output_directory:
    :param upsample_factor: Number of times more neurons to draw than
    the average number of cells in the samples.
    :return:
    """
    points_list = [np.load(p) for p in sample_fpaths]
    coordinates, probability_map = get_average_cord(
        points_list,
        smoothing,
        atlas,
        output_directory,
        upsample_factor=upsample_factor,
    )
    return coordinates, probability_map
