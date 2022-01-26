#!/bin/bash

rm -rf src/apiclient/workspaces
java -jar ../../cloud-harness/utilities/cloudharness_utilities/bin/openapi-generator-cli.jar generate -i http://127.0.0.1:8000/api/schema?format=openapi -g typescript-fetch -o src/apiclient/workspaces