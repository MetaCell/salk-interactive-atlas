from django.core.management.base import BaseCommand

from api.helpers.atlas import get_bg_atlas, get_subdivisions
from api.helpers.density_map.generate_image import generate_grid_images
from api.helpers.exceptions import NoImageDataError
from api.management.utilities import get_valid_atlases
from api.services.atlas_service import save_grid_images, save_grid_metadata


class Command(BaseCommand):
    help = "Generates grid images for the provided atlases"

    def add_arguments(self, parser):
        parser.add_argument("atlases_ids", nargs="+", type=str)

    def handle(self, *args, **options):
        valid_atlas_ids = get_valid_atlases()
        for atlas_id in options["atlases_ids"]:
            if atlas_id not in valid_atlas_ids:
                self.stdout.write(
                    self.style.WARNING(f"{atlas_id} not recognized. Skipping")
                )
                continue
            bg_atlas = get_bg_atlas(atlas_id)
            subdivisions = get_subdivisions(bg_atlas)
            frame_img = None
            for s in subdivisions:
                try:
                    frame_img, complete_img = generate_grid_images(bg_atlas, s)
                except NoImageDataError:
                    continue
                save_grid_images(frame_img, complete_img, s)
            if frame_img:
                w, h = frame_img.size
                metadata = {
                    'width': w,
                    'height': h
                }
                save_grid_metadata(metadata)
        self.stdout.write(self.style.SUCCESS("Generate grids finished"))
