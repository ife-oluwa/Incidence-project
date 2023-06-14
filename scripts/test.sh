#! /usr/bin/env/ bash

set -e

docker-compose run backend pytest
# docker-compose run frontend pytest