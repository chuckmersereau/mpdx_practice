require 'onesky'
require 'JSON'

# Create client
client = Onesky::Client.new(ENV['ONESKY_API_KEY'], ENV['ONESKY_API_SECRET'])

### Work with Project

# show project details
project_id = 190365
project = client.project(project_id)
resp = JSON.parse(project.show)
p resp['data']

# upload file
resp = project.upload_file(file: 'locale/mpdx.pot', file_format: 'GNU_POT')
resp.code # => 201
