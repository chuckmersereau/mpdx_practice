#!/bin/bash
echo '-- run tests --'
npm test || exit 1
echo '-- run eslint --'
eslint . || exit 1

if [ "$TRAVIS_BRANCH" = "master" ]
then
    echo '-- build production --'
    export NODE_ENV=production
else
    echo '-- build staging --'
    export NODE_ENV=staging
fi
npm run build || exit 1
echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html
