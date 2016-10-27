#!/bin/bash
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
aws configure set preview.cloudfront true
if [ "$TRAVIS_BRANCH" = "master" ]
then
  echo 'invalidate master on Cloudfront'
  aws cloudfront create-invalidation --distribution-id E1SB26PD2W62Q1 --paths /index.html
fi

if [ "$TRAVIS_BRANCH" = "staging" ]
then
  echo 'invalidate staging on Cloudfront'
  aws cloudfront create-invalidation --distribution-id E1SHN25G6CRBES --paths /index.html
fi
