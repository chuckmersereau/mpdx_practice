class TwitterLinkController {
}

const twitterLink = {
    template: require('./twitter.html'),
    controller: TwitterLinkController,
    bindings: {
        twitterAccount: '<'
    }
};

export default angular.module('mpdx.common.links.twitter', [])
    .component('twitterLink', twitterLink).name;
