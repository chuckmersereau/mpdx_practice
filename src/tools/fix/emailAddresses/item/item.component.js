import get from 'lodash/fp/get';

class ItemController {
    constructor(
        $scope, blockUI,
        fixEmailAddresses, modal
    ) {
        this.modal = modal;
        this.blockUI = blockUI.instances.get(`fix-email-addresses-item-${$scope.$id}`);
        this.fixEmailAddresses = fixEmailAddresses;
    }
    save() {
        this.blockUI.start();
        return this.fixEmailAddresses.save(this.person).then(() => {
            this.blockUI.reset();
        });
    }
    hasPrimary() {
        return this.fixEmailAddresses.hasPrimary(this.person);
    }
    openPersonModal() {
        const contactId = get('parent_contacts[0]', this.person);
        return this.people.openPeopleModal({ id: contactId }, this.person.id);
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        person: '<'
    }
};

import blockUI from 'angular-block-ui';
import fixEmailAddresses from '../emailAddresses.service';

export default angular.module('mpdx.tools.fix.emailAddresses.item.component', [
    blockUI,
    fixEmailAddresses
]).component('fixEmailAddressesItem', Item).name;
