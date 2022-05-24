import uuid

GENERATE_IMAGES_IMAGE = "workspaces-generate_population_images"


def _create_generate_population_images_task(population_id: int):
    from cloudharness.workflows import tasks
    return tasks.CustomTask(
        name=f"{GENERATE_IMAGES_IMAGE}-{str(uuid.uuid4())[:8]}",
        image_name=GENERATE_IMAGES_IMAGE,
        population_id=population_id,
    )


def execute_generate_population_images_workflow(population_id: int):
    from cloudharness.workflows import operations
    operations.PipelineOperation(
        name=f"salk-generate-population-images-tasks-job",
        tasks=(_create_generate_population_images_task(population_id)),
    ).execute()
