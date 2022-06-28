from django.core.management.base import BaseCommand

from api.helpers.atlas import get_bg_atlas, get_subdivisions
from api.helpers.density_map.generate_image import generate_canal_image
from api.models import AtlasesChoice
from api.services.atlas_service import save_canal_image


class Command(BaseCommand):
    help = 'Generates canal images for the provided atlases'

    def add_arguments(self, parser):
        parser.add_argument('atlases_ids', nargs='+', type=str)

    def handle(self, *args, **options):
        valid_atlas_ids = {e.value for e in AtlasesChoice}
        for atlas_id in options['atlases_ids']:
            if atlas_id not in valid_atlas_ids:
                self.stdout.write(self.style.WARNING(f'{atlas_id} not recognized. Skipping'))
                continue
            bg_atlas = get_bg_atlas(atlas_id)
            subdivisions = get_subdivisions(bg_atlas)
            for s in subdivisions:
                save_canal_image(generate_canal_image(bg_atlas, s), s)
        self.stdout.write(self.style.SUCCESS('Generate canal finished'))
