class WebsiteLinkController {
}

const websiteLink = {
    template: require('./website.html'),
    controller: WebsiteLinkController,
    bindings: {
        website: '<'
    }
};

export default angular.module('mpdx.common.links.website', [])
    .component('websiteLink', websiteLink).name;
