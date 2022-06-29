from api.constants import CAUDAL, ROSTRAL
from api.helpers.ICustomAtlas import ICustomAtlas
from api.helpers.bg_atlasapi_wrapper import SalkAtlas
from api.utils import flat_map

split_segments = lambda seg: [f"{seg['Segment']}-{ROSTRAL}", f"{seg['Segment']}-{CAUDAL}"]


def get_subdivisions(bg_atlas: ICustomAtlas) -> list:
    return flat_map(split_segments, bg_atlas.metadata["atlas_segments"])


def get_subdivision_boundaries(bg_atlas: ICustomAtlas) -> tuple:
    segments_metadata = bg_atlas.metadata["atlas_segments"]

    breakpoints, subdivision = [], []
    segments_metadata.sort(key=lambda s: s["End"])
    for seg in segments_metadata:
        # We are dividing each segment in the brainglobe atlas into
        # 2 evenly separated areas (Rostral and Caudal)
        breakpoints.append((seg["Start"] + seg["End"]) / 2)
        breakpoints.append(seg["End"])
        subdivision.append(f"{seg['Segment']}-{ROSTRAL}")
        subdivision.append(f"{seg['Segment']}-{CAUDAL}")
    return breakpoints, subdivision


def get_bg_atlas(atlas_id: str) -> ICustomAtlas:
    return SalkAtlas(atlas_id)
