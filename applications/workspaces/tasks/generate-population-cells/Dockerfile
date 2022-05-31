ARG WORKSPACES_BASE
FROM $WORKSPACES_BASE

ENV population_id 0
ENV key_filepath ''
ENV data_filepath ''

COPY ${key_filepath} .
COPY ${data_filepath} .

CMD python manage.py generate_population_cells ${population_id} ${key_filepath}