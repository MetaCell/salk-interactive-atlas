import numpy as np

from api.constants import ROSTRAL
from api.helpers.icustom_atlas import ICustomAtlas
from workspaces.settings import POSITION_WITHIN_SUBSEGMENT


class SalkAtlas(ICustomAtlas):

    def __init__(self, atlas_name):
        super().__init__(atlas_name)
        self._annotation = self._get_annotation_with_merged_layers_1_to_4()

    def _get_atlas_merge_layers_1_to_4(self):
        return np.logical_and(self.annotation >= self.get_structure_annotation_value('1Sp'),
                              self.annotation <= self.get_structure_annotation_value('4Sp'))

    def _get_annotation_with_merged_layers_1_to_4(self):
        annotation_copy = self.annotation.copy()
        annotation_copy[self._get_atlas_merge_layers_1_to_4()] = self.get_structure_annotation_value('1-4Sp')
        return annotation_copy

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

    def get_section_idx(self, subdivision, position_within_segment=POSITION_WITHIN_SUBSEGMENT):
        segment_start, segment_end = self.get_subdivision_limits(subdivision)
        return int(
            (segment_end - segment_start) * position_within_segment + segment_start
        )
