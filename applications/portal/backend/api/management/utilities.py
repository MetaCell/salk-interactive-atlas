from api.models import AtlasesChoice, Population
from api.services.workflows_service import execute_generate_population_cells_workflow, create_custom_task, BASE_IMAGE


def get_valid_atlases():
    valid_atlas_ids = {e.value for e in AtlasesChoice}
    return valid_atlas_ids


def handle_populations_upload(experiment_id, populations, filepath, is_fiducial=False):
    tasks_list = []

    for name in populations:
        population = Population.objects.create(
            experiment_id=experiment_id, name=name, is_fiducial=is_fiducial
        )
        tasks_list.append(
            create_custom_task(BASE_IMAGE,
                               command=["python", "manage.py",
                                        f"generate_population_cells",
                                        f"{population.id}",
                                        f"{filepath}"])
        )
    execute_generate_population_cells_workflow(tuple(tasks_list))
