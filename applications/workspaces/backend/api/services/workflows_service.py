import uuid

GENERATE_IMAGES_IMAGE = "workspaces-generate-population-images"
GENERATE_IMAGES_TASK_NAME = "workspaces-generate-population-images"
GENERATE_IMAGES_OP = "salk-generate-population-images-tasks-op"


def _create_generate_population_images_task(population_id: int):
    from cloudharness.workflows import tasks
    return tasks.CustomTask(
        name=f"{GENERATE_IMAGES_TASK_NAME}-{str(uuid.uuid4())[:8]}",
        image_name=GENERATE_IMAGES_IMAGE,
        population_id=population_id,
    )


def execute_generate_population_images_workflow(population_id: int):
    from cloudharness.workflows import operations
    shared_directory = "salk-files:/usr/src/app/persistent"
    operations.PipelineOperation(
        basename=GENERATE_IMAGES_OP,
        tasks=(_create_generate_population_images_task(population_id),),
        shared_directory=shared_directory
    ).execute()
