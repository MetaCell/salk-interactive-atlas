FROM node:16-alpine as base
ENV BUILDDIR=/builddir

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
