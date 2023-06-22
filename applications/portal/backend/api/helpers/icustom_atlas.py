from abc import ABC, abstractmethod

from bg_atlasapi import BrainGlobeAtlas

from workspaces.settings import POSITION_WITHIN_SUBDIVISION


class ICustomAtlas(ABC, BrainGlobeAtlas):
    def __init__(self, atlas_name):
        super().__init__(atlas_name)

    def get_id(self):
        return self.atlas_name

    @abstractmethod
    def get_image_volume(self, region_key):
        pass

    @abstractmethod
    def get_subdivision_limits(self, subdivision: str) -> tuple:
        pass

    @abstractmethod
    def get_section_idx(self, subdivision, position_within_segment=POSITION_WITHIN_SUBDIVISION):
        pass

    @abstractmethod
    def get_structure_annotation_value(self, structure_key: str) -> int:
        pass