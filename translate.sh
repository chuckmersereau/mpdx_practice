#!/bin/bash
set -e

gulp extract
bundle install
bundle exec ruby onesky/upload.rb
bundle exec ruby onesky/download.rb
