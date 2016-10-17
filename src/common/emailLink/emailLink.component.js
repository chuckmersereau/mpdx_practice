class EmailLinkController {
}

const emailLink = {
    template: require('./emailLink.html'),
    controller: EmailLinkController,
    bindings: {
        emailAddress: '<'
    }
};

export default angular.module('mpdx.common.emailLink', [])
    .component('emailLink', emailLink).name;
