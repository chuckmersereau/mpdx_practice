class FacebookLinkController {
}

const facebookLink = {
    template: require('./facebookLink.html'),
    controller: FacebookLinkController,
    bindings: {
        facebookAccount: '<'
    }
};

export default angular.module('mpdx.common.facebookLink', [])
    .component('facebookLink', facebookLink).name;
