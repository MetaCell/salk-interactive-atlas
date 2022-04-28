import logging
import numpy as np

from scipy.ndimage.measurements import center_of_mass

from cordmap.constants import GM_REGIONS


def atlas_section_from_segment(
    atlas_segment,
    atlas_segments,
    column_to_report="Start",
    segment_name_header="Segment",
):
    return int(
        atlas_segments.loc[
            atlas_segments[segment_name_header] == atlas_segment,
            column_to_report,
        ]
    )


def load_create_cord_gm_atlas_volume_image(
    atlas, use_cord_for_reg=True, use_gm_for_reg=True, return_points=False
):
    annotation = atlas.annotation
    cord_gm_atlas_slice_image = create_cord_gm_atlas_image(
        annotation, cord=use_cord_for_reg, gm=use_gm_for_reg
    )
    if return_points:
        centroids = get_central_canal_centroids(annotation, atlas)
    else:
        centroids = None
    return annotation, cord_gm_atlas_slice_image, centroids


def get_central_canal_centroids(annotation, atlas, central_canal_acronym="CC"):
    central_canal_image = (
        annotation == atlas.structures[central_canal_acronym]["id"]
    )

    centroids = []
    for plane in central_canal_image:
        y, x = center_of_mass(plane)
        centroids.append(np.array((int(y), int(x))))
    return centroids


def create_cord_gm_atlas_image(annotation_image, cord=True, gm=True):
    if not cord and not gm:
        logging.warning(
            "Cord and grey matter are both deselected, using both " "anyway"
        )
        cord = True
        gm = True

    if cord:
        annotation_mask = annotation_image.astype(np.bool8).astype(np.float32)
        if not gm:
            return annotation_mask
    if gm:
        gm_mask = get_atlas_regions(annotation_image, GM_REGIONS).astype(
            np.float32
        )
        if not cord:
            return gm_mask

    return annotation_mask + gm_mask


def get_atlas_regions(image, regions=None):
    """
    Mask the atlas array by brain region
    :param image: nD atlas image
    :param regions: list of atlas regions by ID,
    e.g. [1, 2, 3, 4, 5, 6, 7, 8] for GM
    :return: boolean array of atlas regions
    """
    if regions:
        return np.isin(image, regions)
    else:
        return None
