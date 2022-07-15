from abc import ABC, abstractmethod

import numpy as np
from PIL import Image

from api.helpers.ICustomAtlas import ICustomAtlas


class IImageCreator(ABC):
    @abstractmethod
    def create(self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array) -> Image:
        pass