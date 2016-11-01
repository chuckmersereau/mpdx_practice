#!/bin/bash
echo '-- run tests --'
npm test
echo '-- run eslint --'
eslint ./

if [ "$TRAVIS_BRANCH" = "master" ]
then
    echo '-- build production --'
    set NODE_ENV=production
else
    echo '-- build staging --'
    set NODE_ENV=staging
fi
npm run build
