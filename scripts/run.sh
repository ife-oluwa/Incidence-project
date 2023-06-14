#!/bin/bash

# Exist in case of error
set -e

# Run containers
docker-compose --env-file .env up -d

