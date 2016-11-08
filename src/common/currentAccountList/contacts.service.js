

class Contacts {
    api;

    constructor(api) {
        this.api = api;
    }
    getLatePledgeCount() {
        return this.api.get('contacts/late_pledges/count');
    }
    getLatePledgeDays() {
        return this.api.get('contacts/late_pledges/days');
    }
}

export default angular.module('mpdx.common.currentAccountList.contacts', [])
    .service('currentAccountListContacts', Contacts).name;
