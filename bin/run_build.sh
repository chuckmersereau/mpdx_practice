#!/bin/bash
set -e

if [ "$RUN_BUILD" = "true" ]
then
    if [ "$TRAVIS_BRANCH" = "master" ]
    then
        echo '-- build production --'
        export NODE_ENV=production
    elif [ "$TRAVIS_BRANCH" = "next" ]
    then
        echo '-- build next --'
        export NODE_ENV=next
    else
        echo '-- build staging --'
        export NODE_ENV=staging
    fi

    echo '-- run build --'
    yarn run build

    echo '<!-- COMMIT:' $TRAVIS_COMMIT '-->' >> public/index.html

    if [ "$TRAVIS_PULL_REQUEST" = "false" ]
    then
        echo '-- extract translations from source --'
        gulp extract

        echo '-- download mpdx.pot from onesky --'
        node onesky/downloadPotFile

        echo '-- merge source & onesky pot files --'
        msgcat src/locale/mpdx-onesky.pot src/locale/mpdx.pot -o src/locale/mpdx-merged.pot

        echo '-- upload mpdx.pot to onesky --'
        node onesky/upload

        echo '-- download translation po from onesky --'
        node onesky/downloadPoFiles

        echo '-- extract language po into angular-gettext json --'
        gulp translations
    else
        echo 'Skipping translation because the current build is a pull request.'
    fi
fi
