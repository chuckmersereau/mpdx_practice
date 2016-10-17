class TwitterLinkController {
}

const twitterLink = {
    template: require('./twitterLink.html'),
    controller: TwitterLinkController,
    bindings: {
        twitterAccount: '<'
    }
};

export default angular.module('mpdx.common.twitterLink', [])
    .component('twitterLink', twitterLink).name;
