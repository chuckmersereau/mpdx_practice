'use strict';

const each = require('lodash/fp/each');
const filter = require('lodash/fp/filter');

const onesky = require('onesky')(process.env.ONESKY_API_KEY, process.env.ONESKY_API_SECRET);
const fs = require('fs');

onesky.platform.locales('190365', (err, data) => {
    if (err) {
        console.log('error downloading onesky languages');;
        console.log(err);
        process.exit(1);
    }
    const active = filter(lang => lang.completeness > 0, data.locales);
    console.log(active);
    each((locale) => {
        console.log(`downloading ${locale.locale}`);
        onesky.string.download({
            platformId: 190365,
            locale: locale.locale,
            format: 'GNU_PO'
        }, (err, data) => {
            console.log('here');
            if (err) {
                console.log('error downloading onesky languages');;
                console.log(err);
                process.exit(1);
            }
            console.log(data);
        });
    }, active);
});

// const contents = fs.readFileSync('src/locale/mpdx.pot', 'utf8').toString();
// const options = {
//     language: 'en',
//     secret: process.env.ONESKY_API_SECRET,
//     apiKey: process.env.ONESKY_API_KEY,
//     projectId: '190365',
//     fileName: 'mpdx.pot',
//     format: 'GNU_POT',
//     content: contents,
//     keepStrings: false
// };
// onesky.postFile(options).then((content) => {
//     console.log('file successfully uploaded to onesky.');
//     console.log(content);
// }).catch((error) => {
//     console.log('onesky upload failed.');
//     console.log(error);
//     process.exit(1);
// });
//
//
// require 'onesky'
// require 'json'
// require 'fileutils'
//
// # Create client
// client = Onesky::Client.new(ENV['ONESKY_API_KEY'], ENV['ONESKY_API_SECRET'])
//
// ### Work with Project
//     project = client.project(190365)
//
// # show project details
// resp = JSON.parse(project.list_language)
// resp['data'].each do |locale|
// next unless locale['is_ready_to_publish'] || ENV['TRAVIS_BRANCH'] == 'staging' && locale['translation_progress'].to_i > 0
// resp = project.export_translation(source_file_name: 'mpdx.pot', locale: locale['code'])
// FileUtils::mkdir_p('locale')
// File.open("locale/#{locale['code']}-#{ENV['TRAVIS_COMMIT']}.po", 'w') { |file| file.write(resp)}
// puts "#{locale['code']} => locale/#{locale['code']}-#{ENV['TRAVIS_COMMIT']}.po"
// end
