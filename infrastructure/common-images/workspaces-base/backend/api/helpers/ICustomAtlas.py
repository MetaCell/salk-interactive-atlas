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
    def get_arbitrary_cord_midpoint_image(self, start, end, image):
        pass

    @abstractmethod
    def get_annotation(self, structure_key_list):
        pass
