const LinkedinLink = {
    template: require('./linkedin.html'),
    bindings: {
        linkedinAccount: '<'
    }
};

export default angular.module('mpdx.common.links.linkedin.component', [])
    .component('linkedinLink', LinkedinLink).name;
