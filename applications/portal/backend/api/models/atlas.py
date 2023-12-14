import logging

from api.helpers.icustom_atlas import ICustomAtlas
from api.models import AtlasesChoice

# Get an instance of a logger
logger = logging.getLogger(__name__)

salkAtlasses = {}


def add_atlas(atlas_id: str) -> ICustomAtlas:
    from api.helpers.bg_atlasapi_wrapper import SalkAtlas
    salkAtlas = SalkAtlas(atlas_id)
    salkAtlasses.update({atlas_id: salkAtlas})
    return salkAtlas


def get_atlas(atlas_id: str) -> ICustomAtlas:
    if atlas_id in salkAtlasses:
        return salkAtlasses[atlas_id]
    return add_atlas(atlas_id)


for atlas_id in (e.value for e in AtlasesChoice):
    logger.info(f"adding atlas {atlas_id}")
    add_atlas(atlas_id)
