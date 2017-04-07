'use strict';

const each = require('lodash/fp/each');
const filter = require('lodash/fp/filter');
const get = require('lodash/fp/get');

const oneskyOld = require('onesky')(process.env.ONESKY_API_KEY, process.env.ONESKY_API_SECRET); //old api
const onesky = require('onesky-utils'); // new platform api (missing list)
const fs = require('fs');

function ifErrMsg(msg, err) {
    if (err) {
        console.log(msg);
        console.log(err);
        process.exit(1);
    }
}

oneskyOld.platform.locales('190365', (err, data) => {
    ifErrMsg('error downloading onesky languages', err);
    const active = filter(lang => lang.completeness > 0, data.locales);
    each((locale) => {
        const filename = `${locale.locale}${get('TRAVIS_COMMIT', process.env) || ''}.po`;
        const options = {
            language: locale.locale,
            secret: process.env.ONESKY_API_SECRET,
            apiKey: process.env.ONESKY_API_KEY,
            projectId: '190365',
            fileName: 'mpdx.pot'
        };
        console.log(`downloading ${locale.locale}`);
        onesky.getFile(options).then((content) => {
            fs.writeFile(`locale/${filename}`, content, (err) => {
                ifErrMsg(`unable to write file ${filename}`, err);
                console.log(`${locale.locale} saved`);
            });
        }).catch((error) => {
            ifErrMsg(`error downloading ${locale.locale}`, error);
        });
    }, active);
});