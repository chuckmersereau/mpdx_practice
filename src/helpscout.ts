(window as any).HSCW = (window as any).HSCW || {};
(window as any).HS = (window as any).HS || {};
(window as any).HS.beacon = (window as any).HS.beacon || {};
let t = (window as any).HS.beacon;
t.userConfig = {};
t.readyQueue = [];
t.config = function(e) {
    this.userConfig = e;
};
t.ready = function(e) {
    this.readyQueue.push(e);
};

(window as any).HSCW.config = {
    docs: {
        enabled: true,
        baseUrl: '//mpdx.helpscoutdocs.com/'
    },
    contact: {
        enabled: true,
        formId: '2388288c-07f9-11e7-b148-0ab63ef01522'
    }
};
const r = document.getElementsByTagName('script')[0];
let c = document.createElement('script');
c.type = 'text/javascript';
c.async = true;
c.src = 'https://djtflbt20bdde.cloudfront.net/';
r.parentNode.insertBefore(c, r);

(window as any).HS.beacon.config({
    autoInit: false
});