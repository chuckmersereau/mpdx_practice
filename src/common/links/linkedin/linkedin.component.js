class LinkedInLinkController {
    $onInit() {
        this.url = `http://www.linkedin.com/${this.linkedinAccount.username}`;
    }
}

const LinkedinLink = {
    template: require('./linkedin.html'),
    controller: LinkedInLinkController,
    bindings: {
        linkedinAccount: '<'
    }
};

export default angular.module('mpdx.common.links.linkedin.component', [])
    .component('linkedinLink', LinkedinLink).name;
