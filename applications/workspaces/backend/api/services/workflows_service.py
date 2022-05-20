import uuid

from cloudharness.workflows import tasks, operations

GENERATE_IMAGES_IMAGE = "workspaces-generate_population_images"


def _create_generate_population_images_task(population_id: int):
    return tasks.CustomTask(
        name=f"{GENERATE_IMAGES_IMAGE}-{str(uuid.uuid4())[:8]}",
        image_name=GENERATE_IMAGES_IMAGE,
        population_id=population_id,
    )


def execute_generate_population_images_workflow(population_id: int):
    task = _create_generate_population_images_task(population_id)
    op = operations.SingleTaskOperation(
        name=f"salk-generate-population-images-tasks-job",
        task=task
    )
    op.execute()
