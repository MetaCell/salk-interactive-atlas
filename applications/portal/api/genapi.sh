#!/bin/bash

CH_CURRENT_APP_NAME=portal ../backend/manage.py generateschema --generator_class workspaces.urls.SecuredOpenApiGenerator --file openapi.yaml
