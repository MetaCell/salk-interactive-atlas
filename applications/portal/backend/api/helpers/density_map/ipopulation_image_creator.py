from abc import ABC, abstractmethod
from typing import Dict

import numpy as np
from PIL.Image import Image

from api.constants import PopulationPersistentFiles
from api.helpers.icustom_atlas import ICustomAtlas


class IPopulationImageCreator(ABC):
    @abstractmethod
    def create(
        self, bg_atlas: ICustomAtlas, subdivision: str, points: np.array, is_residential: bool
    ) -> Dict[PopulationPersistentFiles, Image]:
        pass
