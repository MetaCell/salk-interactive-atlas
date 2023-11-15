from django.db import transaction

from api.models import AtlasesChoice, Population, PopulationStatus, Experiment


def get_valid_atlases():
    valid_atlas_ids = {e.value for e in AtlasesChoice}
    return valid_atlas_ids


def register_experiment(data_filepath, experiment_id, population_names):
    populations = []
    with transaction.atomic():
        for name in population_names:
            populations.append(Population.objects.create(
                experiment_id=experiment_id,
                name=name,
                is_fiducial=False,
                status=PopulationStatus.PENDING
            ))
    experiment = Experiment.objects.get(pk=experiment_id)
    experiment.register(data_filepath, populations)
