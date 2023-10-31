from api.models import Experiment, Tag
from api.services.workflows_service import create_custom_task, BASE_IMAGE, execute_experiment_registration_workflow


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


def register_non_fiducial_experiment(experiment_id, key_filepath, data_filepath):
    return _register_experiment('register_non_fiducial_experiment', experiment_id, key_filepath, data_filepath)


def register_fiducial_experiment(experiment_id, filepath):
    return _register_experiment('register_fiducial_experiment', experiment_id, filepath)


def _register_experiment(command_name, *args):
    str_args = [str(arg) for arg in args]
    command = [
        "python", "manage.py",
        command_name,
        *str_args
    ]
    task = create_custom_task(BASE_IMAGE, command=command)

    execute_experiment_registration_workflow((task,))
