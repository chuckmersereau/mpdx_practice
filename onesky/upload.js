'use strict';

const onesky = require('onesky-utils');
const fs = require('fs');

const contents = fs.readFileSync('src/locale/mpdx.pot', 'utf8').toString();
const options = {
    language: 'en',
    secret: process.env.ONESKY_API_SECRET,
    apiKey: process.env.ONESKY_API_KEY,
    projectId: '190365',
    fileName: 'mpdx.pot',
    format: 'GNU_POT',
    content: contents,
    keepStrings: false
};
onesky.postFile(options).then((content) => {
    console.log('file successfully uploaded to onesky.');
    console.log(content);
}).catch((error) => {
    console.log('onesky upload failed.');
    console.log(error);
    process.exit(1);
});
