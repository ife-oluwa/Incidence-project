#! /usr/bin/env/ bash

set -e

docker-compose run backend pytest --cov
# docker-compose run frontend pytest