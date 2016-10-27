#!/bin/bash
NODE_ENV=test npm test
eslint ./
if [ "$TRAVIS_BRANCH" = "master" ]
then
  NODE_ENV=production npm run build
else
  NODE_ENV=staging npm run build
fi
