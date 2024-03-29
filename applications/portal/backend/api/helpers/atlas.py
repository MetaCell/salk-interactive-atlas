import numpy as np

from api.constants import CAUDAL, ROSTRAL
from api.helpers.icustom_atlas import ICustomAtlas
from api.utils import flat_map

from api.models.atlas import get_atlas

split_segments = lambda seg: [
    f"{seg['Segment']}-{ROSTRAL}",
    f"{seg['Segment']}-{CAUDAL}",
]


def get_subdivisions(bg_atlas: ICustomAtlas) -> list:
    return flat_map(split_segments, bg_atlas.metadata["atlas_segments"])


def get_subdivision_boundaries(bg_atlas: ICustomAtlas) -> tuple:
    segments_metadata = bg_atlas.metadata["atlas_segments"]

    breakpoints, subdivision = [], []
    segments_metadata.sort(key=lambda s: s["End"])
    for seg in segments_metadata:
        # We are dividing each segment in the brainglobe atlas into
        # 2 evenly separated areas (Rostral and Caudal)
        # lower bound is inclusive
        breakpoints.append((seg["Start"] + seg["End"]) / 2)
        breakpoints.append(seg["End"])
        subdivision.append(f"{seg['Segment']}-{ROSTRAL}")
        subdivision.append(f"{seg['Segment']}-{CAUDAL}")
    return breakpoints, subdivision


def get_bg_atlas(atlas_id: str) -> ICustomAtlas:
    return get_atlas(atlas_id)


def get_img_min_y(img: np.array) -> int:
    item_index = np.where(img > 0)
    return int(item_index[0].min())
