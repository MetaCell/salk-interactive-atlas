import os
import uuid
from pathlib import PosixPath
from typing import Tuple

from django.conf import settings

from api.models import Population

# this import only works when running in kubernetes
# for django collect static in a Docker build we
# catch the error
try:
    from cloudharness.workflows import operations, tasks
except:
    pass
from cloudharness.applications import get_current_configuration

BASE_IMAGE = "portal"
GENERATE_IMAGES_OP = "salk-generate-population-static-files-tasks-op"
VOLUME_FOLDER = "/usr/src/app/persistent"
GENERATE_CELLS_IMAGE = "portal"
GENERATE_CELLS_OP = "salk-generate-population-cells-tasks-op"
UPLOAD_FILES_OP = "salk-upload-files-tasks-op"


def create_custom_task(image_name, **kwargs):
    return tasks.CustomTask(
        name=f"{image_name}-{str(uuid.uuid4())[:8]}", image_name=image_name, **kwargs
    )


def _get_pod_context(current_app):
    return operations.PodExecutionContext(
        "usesvolume", current_app.harness.deployment.volume.name, required=True
    )


def _get_shared_directory(current_app):
    return f"{current_app.harness.deployment.volume.name}:{VOLUME_FOLDER}"


def execute_generate_population_static_files_workflow(population_id: int):
    current_app = get_current_configuration()
    operations.PipelineOperation(
        basename=GENERATE_IMAGES_OP,
        tasks=(
            create_custom_task(
                BASE_IMAGE,
                command=["python", "manage.py", "generate_population_static_files", f"{population_id}"],
            ),
        ),
        shared_directory=_get_shared_directory(current_app),
        pod_context=_get_pod_context(current_app),
    ).execute()


def execute_generate_population_cells_workflow(tasks_tuple: Tuple):
    current_app = get_current_configuration()
    operations.ParallelOperation(
        basename=GENERATE_CELLS_OP,
        tasks=tasks_tuple,
        shared_directory=_get_shared_directory(current_app),
        pod_context=_get_pod_context(current_app),
    ).execute()


def execute_upload_files_workflow(experiment_id: int, key_filepath: str, data_filepath: str):
    current_app = get_current_configuration()
    operations.PipelineOperation(
        basename=UPLOAD_FILES_OP,
        tasks=(
            create_custom_task(
                BASE_IMAGE,
                command=["python", "manage.py", "initialize_files_upload", f"{experiment_id}", f"{key_filepath}",
                         f"{data_filepath}"],
            ),
        ),
        shared_directory=_get_shared_directory(current_app),
        pod_context=_get_pod_context(current_app),
    ).execute()
