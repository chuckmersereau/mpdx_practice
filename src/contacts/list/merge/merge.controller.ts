import { first, get, map, reject } from 'lodash/fp';

class MergeContactsController {
    winner: any;
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private contacts: ContactsService,
        private selectedContacts: any[]
    ) {
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

import contacts, { ContactsService } from '../../contacts.service';

export default angular.module('mpdx.contacts.list.merge.controller', [
    contacts
]).controller('mergeContactsController', MergeContactsController).name;
