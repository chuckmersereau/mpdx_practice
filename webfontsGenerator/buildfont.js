'use strict';

const webfontsGenerator = require('webfonts-generator');

webfontsGenerator({
    fontName: 'ci',
    files: [
        'images/email_icon.svg',
        'images/filter_icon.svg',
        'images/letter_icon.svg',
        'images/neg_filter_icon.svg'
    ],
    dest: '../src/styles/fonts/cru',
    templateOptions: {
        classPrefix: 'ci-',
        baseClass: 'ci'
    }
}, (error) => {
    if (error) console.log('Fail!', error);
    else console.log('Done!');
});