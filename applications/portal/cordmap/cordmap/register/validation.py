import numpy as np

from cordmap.utils.data_processing import create_cord_gm_image


def compare_contour_distances(cnt1, cnt2):
    new_cnt1 = []
    for coordinate in list(cnt1):
        if list(coordinate) not in new_cnt1:
            new_cnt1.append(list(coordinate))

    new_cnt2 = []
    for coordinate in list(cnt2):
        if list(coordinate) not in new_cnt2:
            new_cnt2.append(list(coordinate))

    distances = []
    for cgm in new_cnt1:
        for cco in new_cnt2:
            distances.append(np.linalg.norm(np.array(cgm) - np.array(cco)))

    print(min(distances))


def registration_quality_good_enough(
    atlas_image,
    atlas_section_id,
    transformed_cord_outline,
    transformed_gm_outline,
    z_sample_space,
    registration_errors_export_data,
    rejection_threshold_cord_percent=7,
    rejection_threshold_gm_percent=6,
):

    this_atlas_image = atlas_image[atlas_section_id]

    img = create_cord_gm_image(
        transformed_cord_outline, transformed_gm_outline
    )

    transformed_cord_npix = np.count_nonzero(img)
    transformed_gm_npix = np.count_nonzero(img == 2)

    atlas_gm_npix = np.count_nonzero(this_atlas_image == 2)
    atlas_cord_npix = np.count_nonzero(this_atlas_image)

    difference_cord_npix = abs(transformed_cord_npix - atlas_cord_npix)
    difference_gm_npix = abs(transformed_gm_npix - atlas_gm_npix)

    percentage_difference_gm = difference_gm_npix / atlas_gm_npix * 100
    percentage_difference_cord = difference_cord_npix / atlas_cord_npix * 100

    passes_gm = percentage_difference_gm < rejection_threshold_gm_percent
    passes_cord = percentage_difference_cord < rejection_threshold_cord_percent

    registration_errors_export_data.loc[
        len(registration_errors_export_data)
    ] = [
        z_sample_space,
        atlas_section_id,
        not passes_cord,
        not passes_gm,
        percentage_difference_gm,
        percentage_difference_cord,
    ]

    if passes_gm and passes_cord:
        return True
