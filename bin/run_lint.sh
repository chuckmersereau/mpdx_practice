#!/bin/bash
set -e

if [ "$RUN_LINT" = "true" ]
then
    echo '-- run eslint --'
    eslint --fix --config ./.eslintrc.prod.js src
    echo '-- run sass-lint --'
    sass-lint -v --max-warnings 0
fi
