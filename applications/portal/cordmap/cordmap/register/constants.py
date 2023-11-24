import pandas as pd

from cordmap.register_fiducial import bgatlasapi_wrapper

population_ignore_set = [
    "Contour Name 1",
    "Grey",
    "FilledStar",
    "Keep",
    "Asterisk",
    "CCRemove",
    "Remove",
    "Ignore",
]

atlas = bgatlasapi_wrapper.SalkAtlas("salk_cord_10um")


def sorted_atlas_segments(atlas):
    segment_data = atlas.metadata["atlas_segments"]
    sorted_segments = []
    segment_max = 0
    for x in segment_data:
        segment_max = max(segment_max, x["Start"])

    current_z = 0
    while current_z <= segment_max:
        for x in segment_data:
            if x["Start"] == current_z:
                sorted_segments.append(x)
                current_z = x["End"]
    return sorted_segments


def get_atlas_segment_lengths(atlas):
    segment_lengths = []
    segment_keys = []
    sorted_segments = sorted_atlas_segments(atlas)
    for x in sorted_segments:
        segment_lengths.append(x["End"] - x["Start"])
        segment_keys.append(x["Segment"])
    segment_dict = {"Segment": segment_keys, "Length": segment_lengths}
    segments_df = pd.DataFrame.from_dict(segment_dict)
    return segment_dict, segments_df


segment_dict, segments_df = get_atlas_segment_lengths(atlas)
