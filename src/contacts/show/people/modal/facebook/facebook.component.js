import isEmpty from 'lodash/fp/isEmpty';

class FacebookController {
    constructor() {
        this.deleted = false;
    }
    $onInit() {
        //fix for legacy accounts
        if (isEmpty(this.facebookAccount.username) && !isEmpty(this.facebookAccount.remote_id)) {
            this.facebookAccount.username = this.facebookAccount.remote_id;
        }
    }
    remove() {
        this.deleted = true;
        this.onRemove();
    }
}

const Facebook = {
    controller: FacebookController,
    template: require('./facebook.html'),
    bindings: {
        facebookAccount: '=',
        onRemove: '&'
    }
};

export default angular.module('mpdx.contacts.show.personModal.facebook.component', [])
    .component('peopleFacebook', Facebook).name;
