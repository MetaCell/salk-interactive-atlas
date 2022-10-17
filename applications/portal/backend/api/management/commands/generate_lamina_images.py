from typing import List

from django.core.management.base import BaseCommand

from api.helpers.atlas import get_bg_atlas, get_subdivisions
from api.helpers.exceptions import NoImageDataError
from api.helpers.lamina_images import LaminaImages
from api.management.utilities import get_valid_atlases
from api.services.atlas_service import save_laminas_json


def get_laminas(bg_atlas) -> List[str]:
    laminas_set = set()
    for s in bg_atlas.structures.acronym_to_id_map:
        if "Sp" in s:
            if '-' in s:
                begin, end = [int(number_as_str) for number_as_str in s.split('Sp')[0].split('-')]
                while end >= begin:
                    laminas_set = {x for x in laminas_set if not x.startswith(f"{end}Sp")}
                    end -= 1
            laminas_set.add(s)

    return list(laminas_set)


class Command(BaseCommand):
    help = "Generates lamina images for the provided atlases"

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
            subdivisions.sort()
            laminas_metadata = {}
            for s in subdivisions:
                # TODO: Change hardcoded to for lamina in bg_atlas.structures['laminae']
                for l_key in get_laminas(bg_atlas):
                    lamina = bg_atlas.structures[l_key].data
                    try:
                        lamina_images = LaminaImages(lamina["acronym"], bg_atlas, s)
                    except NoImageDataError:
                        continue
                    lamina_images.save_images()
                    if lamina["acronym"] not in laminas_metadata:
                        laminas_metadata[lamina["acronym"]] = lamina_images.minY
            save_laminas_json(laminas_metadata)
        self.stdout.write(self.style.SUCCESS("Generate laminas finished"))
