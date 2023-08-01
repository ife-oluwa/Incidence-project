#!/bin/bash

# Exist in case of error
set -e


docker exec incidence-project-backend-1 bash -c "cd /app/data_utils/ && python file_upload.py upload"

sleep 5

docker exec incidence-project-backend-1 bash -c "cd /app/data_utils/ && python file_upload.py download"

sleep 5

docker exec incidence-project-backend-1 bash -c "cd /app/ml-model/ && kedro run --pipeline=data_science"

