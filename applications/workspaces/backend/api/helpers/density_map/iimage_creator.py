from abc import ABC, abstractmethod

import numpy as np
from PIL import Image
from bg_atlasapi import BrainGlobeAtlas


class IImageCreator(ABC):
    @abstractmethod
    def get_image(self, bg_atlas: BrainGlobeAtlas, subdivision: str, points: np.array) -> Image:
        pass
