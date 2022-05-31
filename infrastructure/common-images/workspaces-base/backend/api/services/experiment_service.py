from api.helpers.exceptions import InvalidInputError
from api.models import Experiment, Population, Tag
from api.services.workflows_service import execute_generate_population_cells_workflow


def add_tag(experiment: Experiment, tag_name: str):
    try:
        tag = experiment.tags.get(name=tag_name)
    except Tag.DoesNotExist:
        tag, created = Tag.objects.get_or_create(name=tag_name)
        experiment.tags.add(tag)
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


def upload_files(experiment: Experiment, population_name: str, key_file, data_file):
    if not key_file or not data_file:
        raise InvalidInputError
    population, created = Population.objects.get_or_create(
        experiment_id=experiment.id, name=population_name)
    execute_generate_population_cells_workflow(population.id, key_file.file.name, data_file.file.name)
    return created
