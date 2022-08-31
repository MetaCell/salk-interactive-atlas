from bg_atlasapi import BrainGlobeAtlas
import trimesh

ATLAS_ID = "salk_cord_10um"

bg_atlas = BrainGlobeAtlas(ATLAS_ID)

atlas_tree = bg_atlas.structures.tree
atlas_tree_mapper = bg_atlas.structures.acronym_to_id_map


def sort_by_start(s):
    return s['Start']


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
        intermediate_mesh = trimesh.intersections.slice_mesh_plane(mesh, [1, 0, 0], [segment['Start'], 0, 0])
        segment_mesh = trimesh.intersections.slice_mesh_plane(intermediate_mesh, [-1, 0, 0], [segment['End'], 0, 0])
        filename = f"{level}_{segment['Segment']}_{node_name}.obj"
        trimesh.exchange.export.export_mesh(segment_mesh, file_obj=filename, file_type='obj')
