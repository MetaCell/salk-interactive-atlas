import numpy as np
import pytest

from cordmap.utils import data_processing


def test_downscale_points():
    points = np.array([[10, 20], [100, 200]])
    downscaled_points = np.array([[1, 2], [10, 20]])
    scale_factor = 10

    # no input
    with pytest.raises(ValueError):
        assert data_processing.downscale_points()

    # scale factor 0
    with pytest.raises(ValueError):
        assert data_processing.downscale_points(points, scale_factor=0)

    # one input, default (no) scaling
    scaled_points = data_processing.downscale_points(points)
    np.testing.assert_equal(scaled_points, points)

    # one input, with scaling
    scaled_points = data_processing.downscale_points(
        points, scale_factor=scale_factor
    )
    np.testing.assert_equal(scaled_points, downscaled_points)

    # two inputs, default (no) scaling
    scaled_points_a, scaled_points_b = data_processing.downscale_points(
        points, points
    )
    np.testing.assert_equal(scaled_points_a, points)
    np.testing.assert_equal(scaled_points_b, points)

    # two inputs, with scaling
    scaled_points_a, scaled_points_b = data_processing.downscale_points(
        points, points, scale_factor=scale_factor
    )
    np.testing.assert_equal(scaled_points_a, downscaled_points)
    np.testing.assert_equal(scaled_points_b, downscaled_points)


def test_downscale_image():
    image = np.array(
        [
            [10, 20, 30, 40],
            [10, 20, 30, 40],
            [10, 20, 30, 40],
            [10, 20, 30, 40],
        ]
    )

    downscaling = 2
    downscaled_image = np.array([[10, 40], [10, 40]])

    # no scaling
    np.testing.assert_equal(data_processing.downscale_image(image), image)

    # scaling
    np.testing.assert_equal(
        data_processing.downscale_image(image, scale_factor=downscaling),
        downscaled_image,
    )
