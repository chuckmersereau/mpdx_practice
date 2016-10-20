class EmailLinkController {
}

const emailLink = {
    template: require('./email.html'),
    controller: EmailLinkController,
    bindings: {
        emailAddress: '<'
    }
};

export default angular.module('mpdx.common.links.email', [])
    .component('emailLink', emailLink).name;
