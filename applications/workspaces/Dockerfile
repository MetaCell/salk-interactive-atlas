# ARG MNP_UI
ARG CLOUDHARNESS_BASE

# FROM $MNP_UI as frontend

# ENV APP_DIR=/app

# WORKDIR ${APP_DIR}
# COPY frontend/package.json ${APP_DIR}
# COPY frontend/package-lock.json ${APP_DIR}
# RUN npm ci

# COPY frontend ${APP_DIR}
# RUN npm run build

#####

FROM $CLOUDHARNESS_BASE

ENV MODULE_NAME=workspaces
ENV PORT=8080
ENV WORKERS=2
ENV PRODUCTION=true
ENV APP_DIR=/usr/src/app

WORKDIR ${APP_DIR}/..
COPY metacell-kcoidc ./metacell-kcoidc
RUN  apk add jpeg-dev zlib-dev git && \
     python3 -m pip install --upgrade pip && \
     python3 -m pip install -e metacell-kcoidc --no-cache-dir --upgrade

WORKDIR ${APP_DIR}
COPY backend/requirements.txt .
RUN  python3 -m pip install -r requirements.txt --no-cache-dir --upgrade

COPY backend ${APP_DIR}
RUN python3 -m pip install -e . && \
    python3 manage.py collectstatic --noinput

RUN mkdir -p ${APP_DIR}/static/www
# COPY --from=frontend app/dist/ ${APP_DIR}/static/www


ENTRYPOINT gunicorn --workers=$WORKERS --bind=0.0.0.0:${PORT} $MODULE_NAME.wsgi:application
