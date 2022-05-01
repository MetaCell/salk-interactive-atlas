import numpy as np
from napari_plugin_engine import napari_hook_implementation


@napari_hook_implementation(specname="napari_get_reader")
def cordmap_load_points(path):

    if not path.endswith(".npy"):
        return None

    return reader_function


def reader_function(path):
    return [
        (
            np.load(path),
            {
                "size": 2,
                "n_dimensional": True,
                "opacity": 0.8,
            },
            "points",
        )
    ]
