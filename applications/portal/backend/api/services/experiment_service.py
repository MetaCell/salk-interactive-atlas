import os.path
from pathlib import PosixPath
from django.conf import settings
from api.models import Experiment, Population, Tag
from api.services.workflows_service import execute_generate_population_cells_workflow, execute_upload_files_workflow


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
    execute_upload_files_workflow(experiment, key_filepath, data_filepath)

