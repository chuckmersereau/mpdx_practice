require 'onesky'
require 'json'
require 'fileutils'

# Create client
client = Onesky::Client.new(ENV['ONESKY_API_KEY'], ENV['ONESKY_API_SECRET'])

### Work with Project
project = client.project(190365)

# show project details
resp = JSON.parse(project.list_language)
resp['data'].each do |locale|
    next unless locale['is_ready_to_publish']
    resp = project.export_translation(source_file_name: 'mpdx.pot', locale: locale['code'])
    FileUtils::mkdir_p('locale')
    File.open("locale/#{locale['code']}-#{ENV['TRAVIS_COMMIT']}.po", 'w') { |file| file.write(resp)}
end
