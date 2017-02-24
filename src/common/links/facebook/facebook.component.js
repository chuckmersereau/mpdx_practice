class FacebookLinkController {
    $onInit() {
        this.url = `http://www.facebook.com/${this.facebookAccount.username}`;
    }
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
