#!/bin/bash

rm -rf src/apiclient/workspaces
java -jar ../../cloud-harness/tools/cloudharness_utilities/bin/openapi-generator-cli.jar generate -i ../api/openapi.yaml -g typescript-axios -o src/apiclient/workspaces --type-mappings Date=string
