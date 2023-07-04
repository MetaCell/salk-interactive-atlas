import numpy as np

from api.constants import ROSTRAL
from api.helpers.icustom_atlas import ICustomAtlas
from workspaces.settings import POSITION_WITHIN_SUBDIVISION


class SalkAtlas(ICustomAtlas):

    def __init__(self, atlas_name):
        super().__init__(atlas_name)

    def get_image_volume(self, region_key):
        """
        Generates 3D numpy array mask of the input region.
        """
        region_id = self.structures[region_key]["id"]
        img = self.annotation == self.get_structure_annotation_value(region_key)
        for child in self.hierarchy.children(region_id):
            img = np.logical_or(img, self.annotation == (child.identifier - 1))
        return img

    def get_structure_annotation_value(self, structure_key: str) -> int:
        structure_id = self.structures[structure_key]["id"]
        return structure_id - 1

    def get_subdivision_limits(self, subdivision: str) -> tuple:
        segment, part = subdivision.split("-")
        for s in self.metadata["atlas_segments"]:
            if s["Segment"] == segment:
                if part == ROSTRAL:
                    return s["Start"], (s["Start"] + s["End"]) / 2
                else:
                    return (s["Start"] + s["End"]) / 2, s["End"]

    def get_section_idx(self, subdivision, position_within_segment=POSITION_WITHIN_SUBDIVISION):
        segment_start, segment_end = self.get_subdivision_limits(subdivision)
        return int(
            (segment_end - segment_start) * position_within_segment + segment_start
        )
