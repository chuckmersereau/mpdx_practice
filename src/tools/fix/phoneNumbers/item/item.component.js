import get from 'lodash/fp/get';

class ItemController {
    constructor(
        blockUI,
        fixPhoneNumbers, people
    ) {
        this.blockUI = blockUI;
        this.fixPhoneNumbers = fixPhoneNumbers;
        this.people = people;
    }

    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-phone-numbers-item-${this.person.id}`);
    }

    save() {
        this.blockUI.start();
        return this.fixPhoneNumbers.save(this.person).then(() => {
            this.blockUI.reset();
        });
    }

    hasPrimary() {
        return this.fixPhoneNumbers.hasPrimary(this.person);
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
import fixPhoneNumbers from '../phoneNumbers.service';
import people from 'contacts/show/people/people.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.item.component', [
    blockUI, fixPhoneNumbers, people
]).component('fixPhoneNumbersItem', Item).name;
