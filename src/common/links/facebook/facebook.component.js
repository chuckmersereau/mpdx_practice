class FacebookLinkController {
}

const facebookLink = {
    template: require('./facebook.html'),
    controller: FacebookLinkController,
    bindings: {
        facebookAccount: '<'
    }
};

export default angular.module('mpdx.common.links.facebook', [])
    .component('facebookLink', facebookLink).name;
