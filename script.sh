#!/bin/bash
set -e

echo '-- run tests --'
npm test

echo '-- run eslint --'
eslint .

if [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
    if [ "$TRAVIS_BRANCH" = "master" ]
    then
        echo '-- build production --'
        export NODE_ENV=production
    else
        echo '-- build staging --'
        export NODE_ENV=staging
    fi

    echo '-- extract translations from source --'
    gulp extract

    echo '-- upload mpdx.pot to onesky --'
    node onesky/upload

    echo '-- download translation po from onesky --'
    node onesky/download

    echo '-- run build --'
    npm run build

    echo '-- extract language po into angular-gettext json --'
    gulp translations

    echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html
else
    echo 'Skipping translation and build because the current build is a pull request.'
fi





