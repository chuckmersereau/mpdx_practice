#!/bin/bash
set -e

if [ "$RUN_TEST" = "true" ]
then
    echo '-- run tests --'
    yarn run test
    yarn run report-coverage
fi
