const emailLink = {
    template: require('./email.html'),
    bindings: {
        emailAddress: '<'
    }
};

export default angular.module('mpdx.common.links.email', [])
    .component('emailLink', emailLink).name;
