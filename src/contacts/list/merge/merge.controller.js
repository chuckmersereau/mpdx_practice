import first from 'lodash/fp/first';
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

class MergeContactsController {
    constructor(
        $scope,
        contacts,
        selectedContacts
    ) {
        this.$scope = $scope;
        this.contacts = contacts;
        this.selectedContacts = selectedContacts;

        this.winner = get('id', first(selectedContacts));
    }
    save() {
        const filtered = reject({ id: this.winner }, this.selectedContacts);
        const winnersAndLosers = map((val) => {
            return {
                winner_id: this.winner,
                loser_id: val.id
            };
        }, filtered);
        return this.contacts.merge(winnersAndLosers).then(() => {
            this.$scope.$hide();
        });
    }
}

import contacts from 'contacts/contacts.service';

export default angular.module('mpdx.contacts.list.merge.controller', [
    contacts
]).controller('mergeContactsController', MergeContactsController).name;
