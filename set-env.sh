#!/bin/bash

# Get absolute path the current folder
# so it doesn't matter from where to run the script
path=$(dirname "$(realpath $0)")

if [ $# -lt 1 ]; then
  echo "Usage: $0 <command>"
  exit 1
fi

(env $(cat "$path/.env" | xargs) "$@")
