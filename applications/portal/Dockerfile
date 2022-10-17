ARG CLOUDHARNESS_DJANGO

FROM $CLOUDHARNESS_DJANGO as backend

ENV MODULE_NAME=workspaces

RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}/..
COPY cordmap ./cordmap
RUN python3 -m pip install -e cordmap --no-cache-dir --upgrade

ADD local-atlas/salk_cord_10um_v1.0.tar.gz /root/.brainglobe/

WORKDIR ${APP_DIR}
COPY backend/requirements.txt .
RUN python3 -m pip install -r requirements.txt --no-cache-dir --upgrade

COPY backend/requirements.txt backend/setup.py .
RUN python3 -m pip install -e .

COPY backend ${APP_DIR}
RUN python3 manage.py collectstatic --noinput

RUN mkdir -p ${APP_DIR}/static/www

# generate static atlas images
RUN python3 manage.py generate_canal_images salk_cord_10um
RUN python3 manage.py generate_grid_images salk_cord_10um
RUN python3 manage.py generate_lamina_images salk_cord_10um
RUN python3 manage.py generate_annotation_images salk_cord_10um

# compile frontend
FROM node:16-alpine as frontend

ENV BUILDDIR=/builddir
ENV APP_DIR=/usr/src/app

COPY --from=backend ${APP_DIR}/persistent/ ${BUILDDIR}/src/assets/atlas/salk_cord_10um/
RUN rm -rf ${BUILDDIR}/src/assets/atlas/salk_cord_10um/*.sqlite3
COPY frontend/package.json ${BUILDDIR}/package.json
COPY frontend/yarn.lock ${BUILDDIR}/yarn.lock
WORKDIR ${BUILDDIR}
RUN npm install --global yarn
RUN yarn install
COPY frontend $BUILDDIR
RUN npm run build

#

FROM backend
ENV BUILDDIR=/builddir

COPY --from=frontend $BUILDDIR/public ${APP_DIR}/static/www
ENV WORKERS=2
CMD uvicorn --workers ${WORKERS} --host 0.0.0.0 --port ${PORT} main:app
