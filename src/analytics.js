import config from 'config';
import scriptJs from 'scriptjs';

// google analytics
window._gaq = window._gaq || [];
window._gaq.push(['_setAccount', 'UA-325725-27']);
(function() {
    let ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = (document.location.protocol === 'https:' ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    let s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

// google tag manager
(function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start':
        new Date().getTime(),
        event: 'gtm.js'
    });
    let f = d.getElementsByTagName(s)[0];
    let j = d.createElement(s);
    let dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-T7BQCNL');

// adobe analytics
window.digitalData = {
    page: {
        category: {
            primaryCategory: '',
            subCategory1: '',
            subCategory2: '',
            subCategory3: ''
        },
        pageInfo: {
            pageName: 'no pageName found'
        }
    },
    user: [{
        profile: [{
            profileInfo: {}
        }]
    }]
};

const url = config.env === 'staging' || config.env === 'next'
    ? '//assets.adobedtm.com/3202ba9b02b459ee20779cfcd8e79eaf266be170/satelliteLib-7973047d2bbc9bb73f3d16528aa95985e95979d5-staging.js'
    : config.env === 'production'
        ? '//assets.adobedtm.com/3202ba9b02b459ee20779cfcd8e79eaf266be170/satelliteLib-7973047d2bbc9bb73f3d16528aa95985e95979d5.js'
        : null;
if (url) {
    scriptJs(url, () => {
        window._satellite && window._satellite.pageBottom();
    });
}