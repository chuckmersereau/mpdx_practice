#!/bin/bash
set -e

if [ "$RUN_LINT" = "true" ]
then
    echo '-- run eslint --'
    eslint .
fi
