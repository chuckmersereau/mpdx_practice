/* eslint no-console: ["off"] */

'use strict';

const onesky = require('@brainly/onesky-utils');
const fs = require('fs');

const getFileOptions = {
    language: 'en',
    secret: process.env.ONESKY_API_SECRET,
    apiKey: process.env.ONESKY_API_KEY,
    projectId: '190365',
    fileName: 'mpdx.pot'
};

function ifErrMsg(msg, err) {
    if (err) {
        console.log(msg, err);
        process.exit(1);
    }
}

onesky.getFile(getFileOptions).then(function(content) {
    console.log('file successfully downloaded from onesky.');
    fs.writeFile('src/locale/mpdx-onesky.pot', content, (err) => {
        ifErrMsg('unable to write file locale/mpdx-onesky.pot', err);
    });
}).catch(function(error) {
    ifErrMsg('onesky download failed.', error);
    process.exit(1);
});
