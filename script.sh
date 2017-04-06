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
gulp extract
bundle install
# if [ "$TRAVIS_PULL_REQUEST" = "false" ]
# then
    node onesky/upload
# else
#    echo 'Skipping translation upload because the current build is a pull request.'
# fi
bundle exec ruby onesky/download.rb
echo '-- run build --'
npm run build
gulp translations
echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html
