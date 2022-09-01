import numpy as np

from api.helpers.ICustomAtlas import ICustomAtlas


class SalkAtlas(ICustomAtlas):

    def __init__(self, atlas_name):
        super().__init__(atlas_name)
        self._annotation = self._get_annotation_with_merged_layers_1_to_4()

    def _get_atlas_merge_layers_1_to_4(self):
        return np.logical_and(self.annotation >= self._get_structure_annotation_value('1Sp'),
                              self.annotation <= self._get_structure_annotation_value('4Sp'))

    def _get_annotation_with_merged_layers_1_to_4(self):
        annotation_copy = self.annotation.copy()
        annotation_copy[self._get_atlas_merge_layers_1_to_4()] = self._get_structure_annotation_value('1-4Sp')
        return annotation_copy

    @property
    def canal(self):
        """
        Generates an image volume of the central canal
        """
        return self.get_image_volume(self.structures["CC"]["id"])

    def get_image_volume(self, region_key):
        """
        Generates 3D numpy array mask of the input region.
        """
        region_id = self.structures[region_key]["id"]
        img = self.annotation == self._get_structure_annotation_value(region_key)
        for child in self.hierarchy.children(region_id):
            img = np.logical_or(img, self.annotation == (child.identifier - 1))
        return img

    def get_annotation(self, structure_key_list):
        new_annotation = np.empty_like(self.annotation)
        for region_key in structure_key_list:
            img = self.get_image_volume(region_key)
            locs = np.where(img)
            new_annotation[locs] = self.structures[region_key]["id"] - 1
        return new_annotation

    def _get_structure_annotation_value(self, structure_key: str) -> int:
        structure_id = self.structures[structure_key]["id"]
        return structure_id - 1
