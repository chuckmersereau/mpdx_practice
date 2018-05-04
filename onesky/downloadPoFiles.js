/* eslint no-console: ["off"] */

'use strict';

const each = require('lodash/fp/each');
const filter = require('lodash/fp/filter');
const get = require('lodash/fp/get');
const onesky = require('@brainly/onesky-utils');
const fs = require('fs');

function ifErrMsg(msg, err) {
    if (err) {
        console.log(msg, err);
        process.exit(1);
    }
}
const getLanguagesOptions = {
    apiKey: process.env.ONESKY_API_KEY,
    secret: process.env.ONESKY_API_SECRET,
    projectId: '190365'
};
onesky.getLanguages(getLanguagesOptions).then(function(data) {
    data = JSON.parse(data);
    const active = filter((lang) => parseFloat(lang.translation_progress) > 0, data.data);
    each((locale) => {
        const filename = `${locale.code}-${get('TRAVIS_COMMIT', process.env) || ''}.po`;
        const getFileOptions = {
            language: locale.code,
            apiKey: process.env.ONESKY_API_KEY,
            secret: process.env.ONESKY_API_SECRET,
            projectId: '190365',
            fileName: 'mpdx.pot'
        };
        console.log(`downloading ${locale.code}`);
        onesky.getFile(getFileOptions).then((content) => {
            fs.writeFile(`locale/${filename}`, content, (err) => {
                ifErrMsg(`unable to write file ${filename}`, err);
                console.log(`${locale.code} saved`);
            });
        }).catch((error) => {
            ifErrMsg(`error downloading ${locale.code}`, error);
        });
    }, active);
}).catch((error) => {
    ifErrMsg('error downloading onesky languages', error);
});
