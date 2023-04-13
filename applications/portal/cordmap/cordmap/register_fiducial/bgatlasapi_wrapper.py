from bg_atlasapi import BrainGlobeAtlas
import numpy as np
import pandas as pd


class SalkAtlas(BrainGlobeAtlas):
    def __init__(self, atlas_name):
        super().__init__(atlas_name)

    def save_segment_files(self):
        print(self.structures)

    @property
    def canal(self):
        """
        Generates an image volume of the central canal
        """
        return self.get_image_volume(self.structures["CC"]["id"])

    def canal_segment_images(self):
        """
        Returns a single slice image for the middle position of
        each segment (C1, C2.. etc) of the central canal.
        """

        return self.get_representative_region_image_for_all_segments("CC")

    def get_representative_region_image_for_all_segments(self, region_acronym):
        """
        Returns a single slice image for the middle position of
        each segment (C1, C2.. etc) of the input key.

        :param region_acronym: the acronym of the cord region

        :return: list of images for whole cord
        """
        return [
            self.get_representative_region_image_for_segment(
                segment_key, region_acronym
            )
            for segment_key in [
                "C1",
                "C2",
                "C3",
                "C4",
                "C5",
                "C6",
                "C7",
                "C8",
                "T1",
            ]
        ]

    def get_image_volume(self, region_key):
        """
        Generates 3D numpy array mask of the input region.
        """
        region_id = self.structures[region_key]["id"]
        img = self.annotation == (region_id - 1)
        for child in self.hierarchy.children(region_id):
            img = np.logical_or(img, self.annotation == (child.identifier - 1))
        return img

    def get_central_canal_segment_image(self, segment_key):
        return self.get_midpoint_of_segment_image(segment_key, self.canal)

    def get_representative_region_image_for_segment(
        self, segment_key, structure_key
    ):
        return self.get_midpoint_of_segment_image(
            segment_key, self.get_image_volume(structure_key)
        )

    def get_midpoint_of_segment_image(self, segment_key, image):
        segment_start, segment_end = self.get_segment_start_and_end(
            segment_key
        )
        segment_midpoint = int((segment_end + segment_start) / 2)
        return image[segment_midpoint]

    def get_segment_start_and_end(self, segment_key):
        df = pd.read_csv(self.root_dir / "Segments.csv")
        segment_start = df[df["Segment"] == segment_key]["Start"]
        segment_end = df[df["Segment"] == segment_key]["End"]
        return int(segment_start), int(segment_end)

    def get_annotation(self, structure_key_list):
        new_annotation = np.empty_like(self.annotation)
        for region_key in structure_key_list:
            img = self.get_image_volume(region_key)
            locs = np.where(img)
            new_annotation[locs] = self.structures[region_key]["id"] - 1
        return new_annotation

    def get_arbitary_cord_midpoint_image(self, start, end, image):
        midpoint = int(end + start / 2)
        return image[midpoint]

    def get_arbitrary_segment_image(
        self, segment_key, image, position_within_segment
    ):
        image_idx = self.get_section_idx(position_within_segment, segment_key)
        return image[image_idx]

    def get_section_idx(self, position_within_segment, segment_key):
        segment_start, segment_end = self.get_segment_start_and_end(
            segment_key
        )
        print(segment_start, segment_end, position_within_segment)
        image_idx = int(
            (segment_end - segment_start) * position_within_segment
            + segment_start
        )
        return image_idx

    def get_atlas_merge_layers_1_to_4(self):
        return np.logical_and(self.annotation > 2, self.annotation <= 7)

    def get_annotation_with_merged_layers_1_to_4(self):
        img = self.annotation.copy()
        img[self.get_atlas_merge_layers_1_to_4()] = 15
        return img

    def fiducial_markers_path(self):
        return self.root_dir / "interpolated_fiducials.csv"
