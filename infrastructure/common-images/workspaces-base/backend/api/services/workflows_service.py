import uuid

from cloudharness.applications import get_current_configuration

GENERATE_IMAGES_IMAGE = "workspaces-generate-population-static-files"
GENERATE_IMAGES_OP = "salk-generate-population-static-files-tasks-op"
VOLUME_FOLDER = "/usr/src/app/persistent"
GENERATE_CELLS_IMAGE = "workspaces-generate-population-cells"
GENERATE_CELLS_OP = "salk-generate-population-cells-tasks-op"


def _create_task(image_name, **kwargs):
    from cloudharness.workflows import tasks
    return tasks.CustomTask(
        name=f"{image_name}-{str(uuid.uuid4())[:8]}",
        image_name=image_name,
        **kwargs
    )


def execute_generate_population_static_files_workflow(population_id: int):
    from cloudharness.workflows import operations
    current_app = get_current_configuration()
    shared_directory = f"{current_app.harness.deployment.volume.name}:{VOLUME_FOLDER}"
    operations.PipelineOperation(
        basename=GENERATE_IMAGES_OP,
        tasks=(_create_task(GENERATE_IMAGES_IMAGE, population_id=population_id),),
        shared_directory=shared_directory
    ).execute()


def execute_generate_population_cells_workflow(population_id: int, key_filepath: str, data_filepath: str):
    from cloudharness.workflows import operations
    operations.PipelineOperation(
        basename=GENERATE_CELLS_OP,
        tasks=(_create_task(GENERATE_CELLS_IMAGE, population_id=population_id, key_filepath=key_filepath,
                            data_filepath=data_filepath),),
    ).execute()
