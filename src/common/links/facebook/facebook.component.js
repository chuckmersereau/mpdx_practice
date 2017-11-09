import defaultTo from 'lodash/fp/defaultTo';
import get from 'lodash/fp/get';

class FacebookLinkController {
    $onInit() {
        const username = get('username', this.facebookAccount);
        const remoteId = get('remote_id', this.facebookAccount);
        const value = defaultTo('', defaultTo(remoteId, username));
        this.url = `http://www.facebook.com/${value}`;
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
