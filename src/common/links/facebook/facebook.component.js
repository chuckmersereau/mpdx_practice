class FacebookLinkController {
    $onInit() {
        this.url = `http://www.facebook.com/${this.facebookAccount.username || this.facebookAccount.remote_id}`;
    }
}

const facebookLink = {
    template: require('./facebook.html'),
    controller: FacebookLinkController,
    bindings: {
        facebookAccount: '<'
    }
};

export default angular.module('mpdx.common.links.facebook.component', [])
    .component('facebookLink', facebookLink).name;
