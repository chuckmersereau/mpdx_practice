#!/bin/bash
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
if [ "$TRAVIS_BRANCH" = "master" ]
then
  echo 'set max-age header on index.html in cru-mpdx-web-prod'
  aws s3 cp s3://cru-mpdx-web-prod/ s3://cru-mpdx-web-prod/ --include "index.html" --metadata-directive REPLACE --acl public-read --cache-control max-age=0,public
fi

if [ "$TRAVIS_BRANCH" = "next" ]
then
  echo 'set max-age header on index.html in cru-mpdx-web-next'
  aws s3 cp s3://cru-mpdx-web-next/ s3://cru-mpdx-web-next/ --include "index.html" --metadata-directive REPLACE --acl public-read --cache-control max-age=0,public
fi

if [ "$TRAVIS_BRANCH" = "staging" ]
then
  echo 'set max-age header on index.html in cru-mpdx-web-stage'
  aws s3 cp s3://cru-mpdx-web-stage/ s3://cru-mpdx-web-stage/ --include "index.html" --metadata-directive REPLACE --acl public-read --cache-control max-age=0,public
fi
