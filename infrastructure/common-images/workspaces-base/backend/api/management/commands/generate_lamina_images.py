from pathlib import PosixPath

from django.core.management.base import BaseCommand

from api.helpers.atlas import get_bg_atlas, get_subdivisions
from api.helpers.density_map.generate_image import generate_canal_image, generate_lamina_image
from api.management.utilities import get_valid_atlases
from api.models import AtlasesChoice
from api.services.atlas_service import save_canal_image, save_lamina_image, save_laminas_json


class Command(BaseCommand):
    help = 'Generates lamina images for the provided atlases'

    def add_arguments(self, parser):
        parser.add_argument('atlases_ids', nargs='+', type=str)

    def handle(self, *args, **options):
        valid_atlas_ids = get_valid_atlases()
        for atlas_id in options['atlases_ids']:
            if atlas_id not in valid_atlas_ids:
                self.stdout.write(self.style.WARNING(f'{atlas_id} not recognized. Skipping'))
                continue
            bg_atlas = get_bg_atlas(atlas_id)
            subdivisions = get_subdivisions(bg_atlas)
            for s in subdivisions:
                # TODO: Change hardcoded to for lamina in bg_atlas.structures['laminae']
                lamina = {'id': 6, 'name': 'Lamina 1', 'acronym': 'L1', 'rgb_triplet': [100, 0, 100],
                          'structure_id_path': [1, 3, 6],
                          'mesh_filename': PosixPath('/home/afonso/.brainglobe/salk_cord_10um_v1.0/meshes/6.obj'),
                          'mesh': None
                          }
                save_lamina_image(generate_lamina_image(bg_atlas, s, lamina['acronym']), lamina['name'], s)
            save_laminas_json(bg_atlas)
        self.stdout.write(self.style.SUCCESS('Generate canal finished'))

