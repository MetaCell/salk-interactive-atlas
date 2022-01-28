ARG CLOUDHARNESS_BASE

FROM $CLOUDHARNESS_BASE

ENV MODULE_NAME=workspaces
ENV WORKERS=2
ENV PORT=8080

WORKDIR /usr/src/app/
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend /usr/src/app
RUN pip install -e . && \
    pip uninstall -y flask && \
    python manage.py collectstatic --noinput

ENTRYPOINT python workspaces/__main__.py
