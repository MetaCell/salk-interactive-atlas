from django.db import transaction

from api.models import AtlasesChoice, Population, PopulationStatus, Experiment
from api.services.experiment_service import register_experiment


def get_valid_atlases():
    valid_atlas_ids = {e.value for e in AtlasesChoice}
    return valid_atlas_ids


def create_populations_and_register_experiment(data_filepath, experiment_id, population_names, is_fiducial=False):
    populations = []
    with transaction.atomic():
        for name in population_names:
            populations.append(Population.objects.create(
                experiment_id=experiment_id,
                name=name,
                is_fiducial=is_fiducial,
                status=PopulationStatus.PENDING
            ))
    experiment = Experiment.objects.get(pk=experiment_id)
    register_experiment(populations, data_filepath, experiment.storage_path)
