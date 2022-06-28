import numpy as np
from api.helpers.ICustomAtlas import ICustomAtlas


class SalkAtlas(ICustomAtlas):
    def __init__(self, atlas_name):
        super().__init__(atlas_name)

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
        img = self.annotation == (region_id - 1)
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

    def get_arbitrary_cord_midpoint_image(self, start, end, image):
        midpoint = int(end + start / 2)
        return image[midpoint]
