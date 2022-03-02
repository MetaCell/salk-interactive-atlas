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

ENV APP_DIR=/usr/src/app
ENV PRODUCTION=true

WORKDIR ${APP_DIR}

COPY backend/requirements.txt .
RUN apk add jpeg-dev zlib-dev git && \
    python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt --no-cache-dir --upgrade && \
    git clone -b feature/449 https://github.com/MetaCell/cloud-harness && \
    python3 -m pip install --upgrade cloud-harness/libraries/cloudharness-common

COPY backend ${APP_DIR}
RUN python3 -m pip install -e . && \
    python manage.py collectstatic --noinput

RUN mkdir -p ${APP_DIR}/static/www
# COPY --from=frontend app/dist/ ${APP_DIR}/static/www


ENTRYPOINT python workspaces/__main__.py
