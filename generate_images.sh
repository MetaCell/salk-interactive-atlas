#!/bin/bash

# set the values for the variables below
cd applications/portal/frontend
BUILDDIR=$(pwd)
cd ../backend
APP_DIR=$(pwd)

# Run Django management commands
python3 manage.py generate_canal_images salk_cord_10um
python3 manage.py generate_grid_images salk_cord_10um
python3 manage.py generate_lamina_images salk_cord_10um
python3 manage.py generate_annotation_images salk_cord_10um

# Copy files from the backend stage
cp -r ${APP_DIR}/persistent/* ${BUILDDIR}/src/assets/atlas/salk_cord_10um/