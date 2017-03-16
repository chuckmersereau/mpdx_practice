'use strict';

const webfontsGenerator = require('webfonts-generator');

webfontsGenerator({
    fontName: 'ci',
    files: [
        'images/alert.svg',
        'images/email_icon.svg',
        'images/filter_icon.svg',
        'images/letter_icon.svg',
        'images/neg_filter_icon.svg'
    ],
    dest: '../src/styles/fonts/cru',
    templateOptions: {
        classPrefix: 'ci-',
        baseSelector: 'ci'
    }
}, (error) => {
    if (error) console.log('Fail!', error);
    else console.log('Done!');
});
