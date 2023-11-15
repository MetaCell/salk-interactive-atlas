import logging

from api.helpers.experiment_registration.experiment_registration_strategy_factory import get_registration_strategy
from api.helpers.population_cells import associate_population_cells_file
from api.models import Experiment, Tag, Population, PopulationStatus
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


def start_non_fiducial_experiment_registration_workflow(experiment_id, key_filepath, data_filepath):
    return _start_registration_workflow('register_non_fiducial_experiment', experiment_id, key_filepath, data_filepath)


def start_fiducial_experiment_registration_workflow(experiment_id, filepath):
    return _start_registration_workflow('register_fiducial_experiment', experiment_id, filepath)


def _start_registration_workflow(command_name, *args):
    str_args = [str(arg) for arg in args]
    command = [
        "python", "manage.py",
        command_name,
        *str_args
    ]
    task = create_custom_task(BASE_IMAGE, command=command)

    execute_experiment_registration_workflow((task,))


def register_experiment(populations, filepath, storage_path):
    if not populations:
        return

    is_fiducial = populations[0].is_fiducial

    # Set status of all provided populations to RUNNING
    Population.objects.filter(id__in=[pop.id for pop in populations]).update(status=PopulationStatus.RUNNING)
    try:
        strategy = get_registration_strategy(is_fiducial)
        # Perform the registration
        strategy.register(filepath, storage_path)

        csv_suffix = strategy.get_csv_suffix()

        # Associate the generated files with the populations and save them
        for population in populations:
            associate_population_cells_file(population, storage_path, csv_suffix)

    except Exception as e:
        logging.error(e)
        for population in populations:
            population.status = PopulationStatus.ERROR
            population.save()
