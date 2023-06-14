#! /usr/bin/env bash

# Exit in case of error
set -e

sleep 5;


docker-compose run backend pytest $@