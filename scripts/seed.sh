#! /usr/bin/env bash

# Exit in case of error
set -e

docker exec incidence-project-backend-1 bash -c "cd /app/data_utils/ && python file_upload.py seed"
