import os
from pathlib import Path
from cordmap.utils import misc


def test_ensure_directory_exists(tmpdir):
    # string
    exist_dir = os.path.join(tmpdir, "test_dir")
    misc.ensure_directory_exists(exist_dir)
    assert os.path.exists(exist_dir)
    os.rmdir(exist_dir)

    # pathlib
    exist_dir_pathlib = Path(tmpdir) / "test_dir2"
    misc.ensure_directory_exists(exist_dir_pathlib)
    assert exist_dir_pathlib.exists()
    exist_dir_pathlib.rmdir()
