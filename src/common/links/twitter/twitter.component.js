class TwitterLinkController {
    $onInit() {
        this.url = `http://www.twitter.com/${this.twitterAccount.screen_name}`;
    }
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
