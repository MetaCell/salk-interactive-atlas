from api.models import AtlasesChoice


def get_valid_atlases():
    valid_atlas_ids = {e.value for e in AtlasesChoice}
    return valid_atlas_ids
