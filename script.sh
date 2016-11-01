#!/bin/bash
echo '-- run tests --'
npm test
echo '-- run eslint --'
eslint ./

if [ "$TRAVIS_BRANCH" = "master" ]
then
    echo '-- build production --'
    export NODE_ENV=production
else
    echo '-- build staging --'
    export NODE_ENV=staging
fi
npm run build
echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html
