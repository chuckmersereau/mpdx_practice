class TwitterController {
    constructor() {
        this.deleted = false;
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Twitter = {
    controller: TwitterController,
    template: require('./twitter.html'),
    bindings: {
        twitterAccount: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.twitter.component', [])
    .component('peopleTwitter', Twitter).name;
