ARG WORKSPACES_BASE
FROM $WORKSPACES_BASE AS atlas_static_assets

RUN python3 manage.py generate_canal_images salk_cord_10um
RUN python3 manage.py generate_lamina_images salk_cord_10um
RUN python3 manage.py generate_annotation_images salk_cord_10um

###

FROM node:16-alpine as base

ENV BUILDDIR=/builddir

COPY --from=static_assets /usr/src/app/persistent/ ${BUILDDIR}/src/assets/atlas/salk_cord_10um/
COPY package.json ${BUILDDIR}/package.json
COPY package-lock.json ${BUILDDIR}/package-lock.json
WORKDIR ${BUILDDIR}
RUN npm install
COPY . $BUILDDIR
RUN npm run build

###

FROM nginx:1.19.3-alpine

ENV BUILDDIR=/builddir

RUN mkdir -p  /usr/share/nginx/html/persistent
COPY --from=base $BUILDDIR/public /usr/share/nginx/html

EXPOSE 80

RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
COPY conf/nginx.conf /etc/nginx/nginx.conf
