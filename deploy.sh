#!/usr/bin/env bash

set -e
AGILE_HELPER_IMAGE_NAME="agile-helper"
AGILE_HELPER_IMAGE_TAG=$(date -u +"%Y%m%dv%I%M")
AGILE_HELPER_IMAGE="$AGILE_HELPER_IMAGE_NAME:$AGILE_HELPER_IMAGE_TAG"
AGILE_HELPER_DOCKER_COMPOSE_LOCATION=/home/agile-helper-deploy

echo "copy the deployment file to remote server"
rsync -av -e ssh --exclude='deploy.sh' --exclude='node_modules' --exclude='.git' --exclude='.gitignore' --exclude='.DS_Store' . root@1.15.47.161:$AGILE_HELPER_DOCKER_COMPOSE_LOCATION

ssh root@1.15.47.161 "
printf '\n\n----------------------------------build image--------------------------------------------'
cd $AGILE_HELPER_DOCKER_COMPOSE_LOCATION
docker build -t "$AGILE_HELPER_IMAGE" .
printf '\n\n----------------------------------export env--------------------------------------------'
export AGILE_HELPER_IMAGE=$AGILE_HELPER_IMAGE
printf '\n\n----------------------------------deploy--------------------------------------------'
docker stack deploy -c docker-compose.yml uma
"