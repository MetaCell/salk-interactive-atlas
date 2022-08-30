import pandas as pd

"""
Mostly from github.com/brainglobe/cellfinder
"""


class Point:
    def __init__(
        self,
        atlas_coordinate,
        structure,
        hemisphere,
    ):
        self.atlas_coordinate = atlas_coordinate
        self.structure = structure
        self.hemisphere = hemisphere


def combine_df_hemispheres(df):
    """
    Combine left and right hemisphere data onto a single row
    :param df:
    :return:
    """
    left = df[df["hemisphere"] == "left"]
    right = df[df["hemisphere"] == "right"]
    left = left.drop(["hemisphere"], axis=1)
    right = right.drop(["hemisphere"], axis=1)
    left.rename(columns={"cell_count": "left_cell_count"}, inplace=True)
    right.rename(columns={"cell_count": "right_cell_count"}, inplace=True)
    both = pd.merge(left, right, on="structure_name", how="outer")
    both = both.fillna(0)
    both["total_cells"] = both.left_cell_count + both.right_cell_count
    both = both.sort_values("total_cells", ascending=False)
    return both


def get_region_totals(points, structures_with_points, output_filename):
    structures_with_points = list(structures_with_points)

    point_numbers = pd.DataFrame(
        columns=("structure_name", "hemisphere", "cell_count")
    )
    for structure in structures_with_points:
        for hemisphere in ("left", "right"):
            n_points = len(
                [
                    point
                    for point in points
                    if point.structure == structure
                    and point.hemisphere == hemisphere
                ]
            )
            if n_points:
                point_numbers = point_numbers.append(
                    {
                        "structure_name": structure,
                        "hemisphere": hemisphere,
                        "cell_count": n_points,
                    },
                    ignore_index=True,
                )
    sorted_point_numbers = point_numbers.sort_values(
        by=["cell_count"], ascending=False
    )

    df = combine_df_hemispheres(sorted_point_numbers)
    df.to_csv(output_filename, index=False)


def summarise_points(
    cells,
    atlas,
    summary_csv_path,
):
    points = []
    structures_with_points = set()
    for idx, point in enumerate(cells):
        try:
            structure_id = atlas.structure_from_coords(point)
            structure = atlas.structures[structure_id]["name"]
            hemisphere = atlas.hemisphere_from_coords(point, as_string=True)
            points.append(Point(point, structure, hemisphere))
            structures_with_points.add(structure)
        # TODO: Add more specific exception & remove from flake8 ignore list
        except:
            continue

    get_region_totals(points, structures_with_points, summary_csv_path)
