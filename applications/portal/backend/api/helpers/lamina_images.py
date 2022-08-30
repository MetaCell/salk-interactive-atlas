import os

from api.constants import LaminasImages
from api.helpers import ICustomAtlas
from api.helpers.atlas import get_img_min_y
from api.helpers.density_map.generate_image import (
    generate_image_contour,
    generate_lamina_image,
)
from api.services.atlas_service import save_image
from workspaces.settings import LAMINAS_PATH


class LaminaImages:
    def __init__(self, acronym: str, bg_atlas: ICustomAtlas, subdivision: str):
        img_array, filled_img = generate_lamina_image(bg_atlas, subdivision, acronym)
        _, contour_img = generate_image_contour(img_array, False)
        _, contour_dashed_img = generate_image_contour(img_array, True)

        self.acronym = acronym
        self.filled = filled_img
        self.contour = contour_img
        self.dashed = contour_dashed_img
        self.minY = get_img_min_y(img_array)
        self.subdivision = subdivision

    def save_images(self):
        save_image(
            self.filled,
            os.path.join(LAMINAS_PATH, self.acronym, LaminasImages.FILLED.value),
            self.subdivision,
        )
        save_image(
            self.contour,
            os.path.join(LAMINAS_PATH, self.acronym, LaminasImages.CONTOUR.value),
            self.subdivision,
        )
        save_image(
            self.dashed,
            os.path.join(LAMINAS_PATH, self.acronym, LaminasImages.DASHED.value),
            self.subdivision,
        )
