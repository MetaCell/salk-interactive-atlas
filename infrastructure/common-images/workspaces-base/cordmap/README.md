# cordmap

## Installation

### For users:
**N.B. cordmap is not yet on PyPI, for now please follow the developer 
instructions**

To download:
Create [conda](https://docs.conda.io/en/latest/) environment (optional):
```bash
conda create --name cordmap python=3.9
```

To install:
```bash
pip install cordmap
```

### For developers:
To download, first fork the [repository](https://github.com/adamltyson/cordmap) 
to your own account, then clone your fork.
```bash
git clone https://github.com/USERNAME/cordmap
```

Create [conda](https://docs.conda.io/en/latest/) environment (optional):
```bash
conda create --name cordmap python=3.9
```

Install editable, development version:

```bash
cd cordmap
pip install .[dev]
```

Set up pre-commit hooks ([black](https://github.com/psf/black) 
and [flake8](https://flake8.pycqa.org/en/latest/)):
```bash
pre-commit install
```

## Usage

### To register data
`cordmap` has a command line interface. Once installed, the user can run the
`cordmap` command to run the software on a single input file.

`cordmap` assumes that input data will be in a single csv file 
with cord outline, grey matter outline and cell positions, along with markers 
for cord segments etc. The file will also have a similarly named key file
(replacing `_Data.csv` with `_Key.csv`) in the same directory. This CSV file 
(`csv_file`) needs to be supplied by the user. 

The user also needs to supply an output directory to save the results
(`output_directory`). 

**Basic usage**
```bash
cordmap /path/to/csv_file.csv /path/to/output_directory
```

**Output files**
By default, four files will be generated in the output directory:
* `transformed_cells.npy` Cells transformed to the atlas space
* `transformed_gm.npy` Grey matter boundary transformed to the atlas space
* `transformed_cord.npy` Cord outline transformed to the atlas space
* `cell_summary.csv` A summary file of the number of cells in each 
atlas region.

There are many optional arguments that can be given. Some of the most useful:
* `--prob-map=True` Generate  a probability map (cell per unit volume). This
will be saved as a tiff file (`probability_map.tiff`) in the same coordinate
space as the atlas.
* `--visualise=True` Automatically visualise the results in napari
* `--atlas allen_cord_20um` Choose a specific atlas, e.g. `allen_cord_20um`

General options:
* `--debug=True` Only run the analysis on part of the data, store
    intermediate files, and increase logging verbosity.
* `--debug-slice-number 10` Use 10 sections (rather than the default 5) for  
debugging (rather than the full dataset)
* `--n-free-cpus 4` If using the parallel option, reserve this many (e.g. 4) 
CPU cores for other tasks
* `--parallel=False` Run analysis on a single CPU core, useful for 
debugging issues

Registration options:
* `--subsample-points 10` Only process a subset (e.g. 1/10) of data for 
speed, at the expense of accuracy.
* `--use-control-points False`Don't use control points for registration, 
in addition to the image-based registration.
* `--image-metric-weight 0.9` Weighting of the image-based registration
    metric
* `--point-metric-weight 0.1` Weighting of the control-point based
    registration metric
* `--use-cord-for-reg False` Don't use the cord outline for registration
* `--use-gm-for-reg False` Don't use the grey matter outline for registration

Probability map options:
* `--save-prob-map False` Don't save the probability map as tiff
* `--mask-prob-map False` Don't mask the probability map, outside of the atlas
* `--prob-map-normalise False` Don't normalise the probability map
* `--prob-map-smoothing 100` Set the probability map smoothing kernel size
to 100 (um)

N.B. There are other options, details of which can be found by running:
```bash
cordmap -h
```

### To visualise data
**Raw data**
A simple command line tool (`cordmap-vis`) exists to visualise raw data in 
napari:

```bash
cordmap-vis /path/to/csv_file.csv
```

Options can be found by running:
```bash
cordmap-vis -h
```

**Registered data**
A napari plugin exists to visualise the registered `.npy` files. Run napari 
from the terminal in your conda environment (`napari`) and drag and drop the 
files into the main terminal window.