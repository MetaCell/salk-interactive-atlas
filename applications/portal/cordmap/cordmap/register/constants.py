import pandas as pd

segment_keys = [
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

segment_lengths = [
    79,
    89,
    99,
    99,
    89,
    89,
    89,
    89,
    49,
]
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

segment_dict = {"Segment": segment_keys, "Length": segment_lengths}
segments_df = pd.DataFrame.from_dict(segment_dict)
# segments_df = pd.DataFrame.from_dict(segment_dict).set_index("Segment").T
