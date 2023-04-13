from api.helpers.atlas import get_subdivisions
from api.helpers.exceptions import DensityMapIncorrectSubdivisionError
from api.helpers.icustom_atlas import ICustomAtlas


def validate_subdivision(atlas: ICustomAtlas, subdivision: str):
    subdivisions = get_subdivisions(atlas)
    if subdivision not in set(subdivisions):
        raise DensityMapIncorrectSubdivisionError

    return True
