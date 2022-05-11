from api.helpers.atlas import get_subdivisions
from api.helpers.exceptions import (
    AuthorizationError,
    DensityMapIncorrectSubdivisionError,
    InvalidInputError,
)


class DensityMapMultipleAtlassesFoundException:
    pass


def validate_density_map(experiment, subdivision, populations):

    if len(populations) == 0:
        raise InvalidInputError

    atlas = populations[0].atlas

    for pop in populations:
        if pop.atlas != atlas:
            raise DensityMapMultipleAtlassesFoundException
        if pop.experiment.id != experiment.id:
            raise AuthorizationError

    subdivisions = get_subdivisions(atlas)
    if subdivision not in set(subdivisions):
        raise DensityMapIncorrectSubdivisionError

    return True
