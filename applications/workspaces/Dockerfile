ARG CLOUDHARNESS_BASE_DEBIAN

FROM $CLOUDHARNESS_BASE_DEBIAN

ENV MODULE_NAME=workspaces
ENV PORT=8080
ENV WORKERS=2
ENV PRODUCTION=true
ENV BASE_DIR=/usr/src
ENV APP_DIR=${BASE_DIR}/app

RUN mkdir -p ${BASE_DIR}

WORKDIR ${BASE_DIR}
RUN apt update -y && apt install libjpeg-dev zlib1g-dev git -y

COPY cloudharness-django ./cloudharness-django
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install -e cloudharness-django --no-cache-dir --upgrade

COPY cordmap ./cordmap
RUN python3 -m pip install -e cordmap --no-cache-dir --upgrade

ADD local-atlas/salk_cord_10um_v1.0.tar.gz /root/.brainglobe/

WORKDIR ${APP_DIR}
COPY backend/requirements.txt .
RUN python3 -m pip install -r requirements.txt --no-cache-dir --upgrade

COPY backend/requirements.txt backend/setup.py ${APP_DIR}
RUN python3 -m pip install -e .

COPY backend ${APP_DIR}
RUN python3 manage.py collectstatic --noinput

RUN mkdir -p ${APP_DIR}/static/www

CMD gunicorn --workers=$WORKERS --bind=0.0.0.0:${PORT} $MODULE_NAME.wsgi:application
