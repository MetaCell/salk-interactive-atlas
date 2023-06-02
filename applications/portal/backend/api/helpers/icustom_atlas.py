from abc import ABC, abstractmethod

from bg_atlasapi import BrainGlobeAtlas


class ICustomAtlas(ABC, BrainGlobeAtlas):
    def __init__(self, atlas_name):
        super().__init__(atlas_name)

    @property
    @abstractmethod
    def canal(self):
        pass

    @abstractmethod
    def get_image_volume(self, region_key):
        pass

    @abstractmethod
    def get_annotation(self, structure_key_list):
        pass

    @abstractmethod
    def get_subdivision_limits(self, subdivision: str) -> tuple:
        pass

    @abstractmethod
    def get_section_idx(self, subdivision, position_within_segment):
        pass
