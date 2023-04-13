import os
import tempfile
from pathlib import Path

import itk
import numpy as np

from cordmap.utils.misc import ensure_directory_exists

TEMP_DIRECTORY = Path(tempfile.mkdtemp(prefix="cordmap_elastix_"))


def register(
    fixed_image,
    moving_image,
    rigid=True,
    affine=True,
    bspline=True,
    registration_metric="AdvancedMeanSquares",
    affine_iterations="2048",
    log=False,
    use_control_points=False,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
    fixed_points=None,
    moving_points=None,
):
    # convert to ITK, view only
    fixed_image = itk.GetImageViewFromArray(fixed_image)
    moving_image = itk.GetImageViewFromArray(moving_image)

    elastix_object = itk.ElastixRegistrationMethod.New(
        fixed_image, moving_image
    )

    if use_control_points:
        fixed_points_file, moving_points_file = write_control_point_files(
            fixed_points, moving_points
        )

        elastix_object.SetFixedPointSetFileName(fixed_points_file)
        elastix_object.SetMovingPointSetFileName(moving_points_file)

        registration_metric = [
            registration_metric,
            "CorrespondingPointsEuclideanDistanceMetric",
        ]
    else:
        registration_metric = [registration_metric]

    parameter_object = setup_parameter_object(
        rigid=rigid,
        affine=affine,
        bspline=bspline,
        rigid_metric=registration_metric,
        affine_metric=registration_metric,
        bspline_metric=registration_metric,
        affine_iterations=affine_iterations,
        use_control_points=use_control_points,
        image_metric_weight=image_metric_weight,
        point_metric_weight=point_metric_weight,
    )
    elastix_object.SetParameterObject(parameter_object)
    elastix_object.SetLogToConsole(log)

    # update filter object
    elastix_object.UpdateLargestPossibleRegion()

    # get results
    result_image = elastix_object.GetOutput()
    result_transform_parameters = elastix_object.GetTransformParameterObject()
    return result_image, result_transform_parameters


def write_control_point_files(
    fixed_points, moving_points, elastix_directory=None
):
    if not elastix_directory:
        ensure_directory_exists(TEMP_DIRECTORY)
        elastix_directory = TEMP_DIRECTORY / str(os.getpid())
        ensure_directory_exists(elastix_directory)

    fixed_points_file = Path(elastix_directory / "fixed_points.txt")
    moving_points_file = Path(elastix_directory / "moving_points.txt")
    write_points_to_file(fixed_points, fixed_points_file)
    write_points_to_file(moving_points, moving_points_file)

    return str(fixed_points_file), str(moving_points_file)


def setup_parameter_object(
    rigid=True,
    affine=True,
    bspline=True,
    rigid_metric=["AdvancedMeanSquares"],
    affine_metric=["AdvancedMeanSquares"],
    bspline_metric=["AdvancedMeanSquares"],
    affine_iterations="2048",
    use_control_points=True,
    image_metric_weight=0.9,
    point_metric_weight=0.1,
):
    parameter_object = itk.ParameterObject.New()

    if rigid:
        parameter_map_rigid = parameter_object.GetDefaultParameterMap("rigid")
        if use_control_points:
            parameter_map_rigid["Registration"] = [
                "MultiMetricMultiResolutionRegistration"
            ]
        parameter_map_rigid["Metric"] = rigid_metric

        parameter_map_rigid["Metric0Weight"] = (str(image_metric_weight),)
        parameter_map_rigid["Metric1Weight"] = (str(point_metric_weight),)

        parameter_object.AddParameterMap(parameter_map_rigid)

    if affine:
        parameter_map_affine = parameter_object.GetDefaultParameterMap(
            "affine"
        )
        if use_control_points:
            parameter_map_affine["Registration"] = [
                "MultiMetricMultiResolutionRegistration"
            ]
        parameter_map_affine["MaximumNumberOfIterations"] = [affine_iterations]
        parameter_map_affine["Metric"] = affine_metric

        parameter_map_affine["Metric0Weight"] = (str(image_metric_weight),)
        parameter_map_affine["Metric1Weight"] = (str(point_metric_weight),)

        parameter_object.AddParameterMap(parameter_map_affine)

    if bspline:
        parameter_map_bspline = parameter_object.GetDefaultParameterMap(
            "bspline"
        )
        if use_control_points:
            parameter_map_bspline["Registration"] = [
                "MultiMetricMultiResolutionRegistration"
            ]
        parameter_map_bspline["Metric"] = bspline_metric

        parameter_map_bspline["Metric0Weight"] = (str(image_metric_weight),)
        parameter_map_bspline["Metric1Weight"] = (str(point_metric_weight),)

        parameter_map_bspline["NumberOfResolutions"] = "4"
        parameter_map_bspline["FinalBSplineInterpolationOrder"] = ("3",)
        parameter_map_bspline["MaximumNumberOfIterations"] = ("512",)
        parameter_object.AddParameterMap(parameter_map_bspline)

    return parameter_object


def point_set_from_txt(file_path):
    points = []
    with open(file_path, "rt") as myfile:
        for myline in myfile:
            string = myline.partition("OutputIndexMoving =")[2]
            string = string.strip()
            string = string.strip("[]")
            string = string.strip()
            y, x = string.split()
            points.append(np.array((int(x), int(y))))
    return np.array(points)


def write_points_to_file(points_in, points_file):
    points_in = points_in.astype(np.int32)
    points_set = open(points_file, "w+")
    points_set.write(f"point\n{len(points_in)}\n")
    if points_in.shape[1] == 3:
        for points in points_in:
            points_set.write(f"{points[0]} {points[1]} {points[2]}\n")
    else:
        for points in points_in:
            points_set.write(f"{points[1]} {points[0]}\n")

    points_set.close()


def transform_points(
    points_in,
    moving_image,
    transform_parameters,
    log=False,
    elastix_directory=None,
    debug=False,
):
    if not elastix_directory:
        ensure_directory_exists(TEMP_DIRECTORY)
        elastix_directory = TEMP_DIRECTORY / str(os.getpid())

    ensure_directory_exists(elastix_directory)

    points_file = Path(elastix_directory / "fixed_point_set_test.txt")
    transformed_points_file = Path(elastix_directory / "outputpoints.txt")

    write_points_to_file(points_in, points_file)

    moving_image = itk.GetImageViewFromArray(moving_image)
    transformix_object = itk.TransformixFilter.New(moving_image)
    transformix_object.SetFixedPointSetFileName(str(points_file))
    transformix_object.SetTransformParameterObject(transform_parameters)
    transformix_object.SetLogToConsole(log)
    transformix_object.SetOutputDirectory(str(elastix_directory))
    transformix_object.UpdateLargestPossibleRegion()
    _ = transformix_object.GetOutput()

    transformed_points = point_set_from_txt(transformed_points_file)

    return transformed_points


def transform_multiple_point_sets(
    *points_in,
    moving_image=None,
    result_transform_parameters=None,
    elastix_directory=None,
    log=False,
    debug=False,
):

    return (
        transform_points(
            points,
            moving_image,
            result_transform_parameters,
            elastix_directory=elastix_directory,
            log=log,
            debug=debug,
        )
        for points in points_in
    )
