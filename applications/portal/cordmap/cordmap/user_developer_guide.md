### Data organisation and loading

The raw data that we have been provided by the Salk is organised as follows:

Each sample is provided as two files,  the output of a custom script called Build a Brain, 
which was also developed in house at the Salk. Both files are .csv one of these contains 
all the data (cardinal_subpop_Data.csv), the other is a key  (cardinal_subpop_Key.csv) to 
allow selectively loading out data of particular types. This second file just contains a 
list of keys that can be used as the index of the data files in the "Type" column.

Each category of data is either a contour or a point. Contours are collections of 
points that make the entire outline of particular biological features, for example 
the outline of the grey or white matter. Each z position from a sample would therefore 
contain a grey matter and a white matter contour. These outlines are converted to an 
image which is then the basis of registration. The z position is used to select the 
appropriate 2d image from the atlas to use in this registration.

Data types that are of the type "point" will be treated as cell populations to be 
transformed into atlas space. Contours will be loaded

```python
cordmap.data.io.load_data
```

This function simply reads the files and returns them as dataframes. It also has the option
for flipping the y-axis as this was necessary in the data we were provided.

```python
cordmap.utils.filter_data_by_type
```

This function takes all the keys from the Key.csv and organises the data into a dictionary 
where each key is a data type and the value is the z,x and y positions of all the data for 
that datatype.

```python
cordmap.utils.data_processing.get_single_data_section
```

This function takes data organised by type as explained above and loads the contours for the grey matter white matter and cell positions. It also loads an image where the white matter is the value 1, the grey matter is the value 2. This image will be used in the registration.


Running the registration on a single image:
```python
cordmap.register.elastix.register()
```

Registration functions can be called simply on two images, where the moving image is the one 
that will be changed to fit to the fixed image. For best results, before registration the 
images should be roughly aligned and centered. In this case we register the atlas section to
the sample, so the sample is the "fixed image" and the atlas image is the "moving image". 
When we want to visualise cells in atlas space we therefore use the inverse transform of this
process and apply it to the cell positions in the sample. We do this using the following 
function:

```python
cordmap.register.elastix.transform_multiple_point_sets()
```

Which estimates the position of a set of sample points in atlas space by transforming back 
to the atlas using the result of the registration transform (result_transform_parameters) 
as arguments to return positions within atlas space for this 2d image.