class FacebookController {
    constructor() {
        this.deleted = false;
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
