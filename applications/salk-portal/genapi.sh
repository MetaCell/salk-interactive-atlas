#!/bin/bash

rm -rf src/apiclient/workspaces
java -jar ../../cloud-harness/utilities/cloudharness_utilities/bin/openapi-generator-cli.jar generate -i ../workspaces/api/openapi.yaml -g typescript-fetch -o src/apiclient/workspaces
