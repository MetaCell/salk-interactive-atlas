from django.core.management.base import BaseCommand

from api.helpers.atlas import get_bg_atlas, get_subdivisions
from api.helpers.density_map.annotation_image import generate_annotation_image
from api.models import AtlasesChoice
from api.services.atlas_service import save_annotation_image


class Command(BaseCommand):
    help = 'Generates annotation images for the provided atlases'

    def add_arguments(self, parser):
        parser.add_argument('atlases_ids', nargs='+', type=str)

    def handle(self, *args, **options):
        valid_atlas_ids = {e.value for e in AtlasesChoice}
        for atlas_id in options['atlases_ids']:
            if atlas_id not in valid_atlas_ids:
                self.stdout.write(self.style.WARNING(f'{atlas_id} not recognized. Skipping'))
                continue
            bg_atlas = get_bg_atlas(atlas_id)
            subdivisions = get_subdivisions(atlas_id)
            for s in subdivisions:
                save_annotation_image(generate_annotation_image(bg_atlas, s), s)
        self.stdout.write(self.style.SUCCESS('Generate annotations finished'))