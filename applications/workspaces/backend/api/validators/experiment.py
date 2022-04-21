from rest_framework import status

from api.helpers.atlas import get_subdivision_boundaries


def validate_density_map_request(experiment, subdivision, populations_ids):
    experiment_populations = experiment.population_set.all()

    subdivisions_set = set()
    experiment_populations_ids = []

    for p in experiment_populations:
        _, subdivisions = get_subdivision_boundaries(p.atlas)
        subdivisions_set.update(set(subdivisions))
        experiment_populations_ids.append(p.id)

    if not all(pop_id in experiment_populations_ids for pop_id in populations_ids):
        return status.HTTP_401_UNAUTHORIZED
    if subdivision not in subdivisions_set:
        return status.HTTP_400_BAD_REQUEST
    return status.HTTP_200_OK
