import logging
from django.db import models

from api.helpers.ICustomAtlas import ICustomAtlas


# Get an instance of a logger
logger = logging.getLogger(__name__)

salkAtlasses = {}

# Create your models here.
class AtlasesChoice(models.TextChoices):
    @classmethod
    def to_str(cls, value):
        return next(v for v in list(AtlasesChoice) if v.value == value).label

    SLK10 = "salk_cord_10um", "Salk cord 10um"
    # ALN20 = "allen_cord_20um", "Allen cord 20um"  # for now we disable this atlas


def add_atlas(atlas_id: str) -> ICustomAtlas:
    from api.helpers.bg_atlasapi_wrapper import SalkAtlas
    salkAtlas = SalkAtlas(atlas_id)
    salkAtlasses.update({atlas_id: salkAtlas})
    return salkAtlas

def get_atlas(atlas_id: str) -> ICustomAtlas:
    return salkAtlasses.get(atlas_id, add_atlas(atlas_id))

for atlas_id in (e.value for e in AtlasesChoice):
    logger.info(f"adding atlas {atlas_id}")
    add_atlas(atlas_id)
