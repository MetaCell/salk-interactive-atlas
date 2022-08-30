import os.path

from api.helpers.exceptions import InvalidInputError
from api.models import Experiment, Population, Tag
from api.services.workflows_service import execute_generate_population_cells_workflow


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


def upload_files(experiment: Experiment, data_filepath: str, population_id: int):
    try:
        population_name = os.path.basename(data_filepath).split("_Data")[0]
    except Exception:
        raise InvalidInputError

    created = False
    if population_id:
        try:
            population = Population.objects.get(
                experiment_id=experiment.id, id=population_id
            )
        except Population.DoesNotExist:
            raise InvalidInputError
    else:
        population = Population.objects.create(
            experiment_id=experiment.id, name=population_name
        )
        created = True
    execute_generate_population_cells_workflow(population.id, data_filepath)
    return created
