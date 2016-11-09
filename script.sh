#!/bin/bash
set -e
echo '-- run tests --'
npm test
echo '-- run eslint --'
eslint .
if [ "$TRAVIS_BRANCH" = "master" ]
then

    echo '-- build production --'
    export NODE_ENV=production
else
    echo '-- build staging --'
    export NODE_ENV=staging
fi
echo '-- run translation --'
if [ "$TRAVIS_PULL_REQUEST" = "false" ]
    gulp extract
    bundle install
    bundle exec ruby onesky/upload.rb
    bundle exec ruby onesky/download.rb
else
    echo 'Skipping translation because the current build is a pull request.'
fi
echo '-- run build --'
npm run build
echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html
