#!/bin/bash

rm -rf src/apiclient/workspaces
npx openapi-generator-cli generate -i ../api/openapi.yaml -g typescript-axios -o src/apiclient/workspaces --type-mappings Date=string
