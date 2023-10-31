import os

from django.core.management.base import BaseCommand
from bg_atlasapi import BrainGlobeAtlas
import trimesh

from api.management.utilities import get_valid_atlases
from workspaces import settings


def sort_by_start(s):
    return s['Start']


class Command(BaseCommand):
    help = 'Generate meshes for the application'

    def add_arguments(self, parser):
        parser.add_argument("atlases_ids", nargs="+", type=str)

    def handle(self, *args, **options):
        valid_atlas_ids = get_valid_atlases()
        output_dir = getattr(settings, 'PERSISTENT_DIRECTORY', os.path.join(settings.BASE_DIR, 'persistent'))

        for atlas_id in options["atlases_ids"]:
            if atlas_id not in valid_atlas_ids:
                self.stdout.write(
                    self.style.WARNING(f"{atlas_id} not recognized. Skipping")
                )
                continue

            bg_atlas = BrainGlobeAtlas(atlas_id)
            atlas_tree = bg_atlas.structures.tree
            atlas_tree_mapper = bg_atlas.structures.acronym_to_id_map
            atlas_segments = bg_atlas.metadata["atlas_segments"]
            atlas_segments.sort(key=sort_by_start)
            for node_name in atlas_tree_mapper.keys():
                level = atlas_tree.level(atlas_tree_mapper[node_name])
                mesh_filename = bg_atlas.structures[node_name]['mesh_filename']
                try:
                    mesh = trimesh.load(mesh_filename)
                except ValueError:
                    continue
                for segment in atlas_segments:
                    intermediate_mesh = trimesh.intersections.slice_mesh_plane(mesh, [1, 0, 0],
                                                                               [segment['Start'], 0, 0])
                    segment_mesh = trimesh.intersections.slice_mesh_plane(intermediate_mesh, [-1, 0, 0],
                                                                          [segment['End'], 0, 0])
                    filename = os.path.join(output_dir, f"{level}_{segment['Segment']}_{node_name}.obj")
                    trimesh.exchange.export.export_mesh(segment_mesh, file_obj=filename, file_type='obj')
            self.stdout.write(self.style.SUCCESS('Successfully generated meshes'))
