const websiteLink = {
    template: require('./website.html'),
    bindings: {
        website: '<'
    }
};

export default angular.module('mpdx.common.links.website', [])
    .component('websiteLink', websiteLink).name;
