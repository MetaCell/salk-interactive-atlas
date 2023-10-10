from api.models import Experiment, Tag, Population
from api.services.workflows_service import execute_upload_pair_files_workflow, execute_upload_single_file_workflow, \
    create_custom_task, BASE_IMAGE, execute_generate_population_cells_workflow


def add_tag(experiment: Experiment, tag_name: str, save=True):
    try:
        tag = experiment.tags.get(name=tag_name)
    except Tag.DoesNotExist:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        experiment.tags.add(tag)
        if save:
            experiment.save()

    return tag


def delete_tag(experiment: Experiment, tag_name: str):
    try:
        tag = experiment.tags.get(name=tag_name)
        experiment.tags.remove(tag)
        experiment.save()
    except Tag.DoesNotExist:
        pass
    return True


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
