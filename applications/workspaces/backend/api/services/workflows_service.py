import uuid

from cloudharness.applications import get_current_configuration

GENERATE_IMAGES_IMAGE = "workspaces-generate-population-images"
GENERATE_IMAGES_OP = "salk-generate-population-images-tasks-op"
VOLUME_FOLDER = "/usr/src/app/persistent"


def _create_generate_population_images_task(population_id: int):
    from cloudharness.workflows import tasks
    return tasks.CustomTask(
        name=f"{GENERATE_IMAGES_IMAGE}-{str(uuid.uuid4())[:8]}",
        image_name=GENERATE_IMAGES_IMAGE,
        population_id=population_id,
    )


def execute_generate_population_images_workflow(population_id: int):
    from cloudharness.workflows import operations
    current_app = get_current_configuration()
    shared_directory = f"{current_app.harness.deployment.volume.name}:{VOLUME_FOLDER}"
    operations.PipelineOperation(
        basename=GENERATE_IMAGES_OP,
        tasks=(_create_generate_population_images_task(population_id),),
        shared_directory=shared_directory
    ).execute()
