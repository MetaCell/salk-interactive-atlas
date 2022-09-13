import os.path
from pathlib import PosixPath

from cordmap.get_all_population_keys import get_populations_from_file
from cordmap.register.constants import population_ignore_set
from django.conf import settings

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


def upload_files(experiment: Experiment, key_filepath: str, data_filepath: str):
    key_path = PosixPath(os.path.join(settings.PERSISTENT_ROOT, key_filepath))
    populations = get_populations_from_file(key_path, population_ignore_set)
    populations_ids = []
    for name in populations:
        population = Population.objects.create(
            experiment_id=experiment.id, name=name
        )
        populations_ids.append(population.id)
    execute_generate_population_cells_workflow(populations_ids, data_filepath)
