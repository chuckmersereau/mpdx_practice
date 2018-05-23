import 'angular-block-ui';
import { get } from 'lodash/fp';
import fixPhoneNumbers, { FixPhoneNumbersService } from '../phone.service';
import people, { PeopleService } from '../../../../contacts/show/people/people.service';

class ItemController {
    person: any;
    constructor(
        private blockUI: IBlockUIService,
        private fixPhoneNumbers: FixPhoneNumbersService,
        private people: PeopleService
    ) {}
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

const Item: ng.IComponentOptions = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        person: '<'
    }
};

export default angular.module('mpdx.tools.fix.phoneNumbers.item.component', [
    'blockUI',
    fixPhoneNumbers, people
]).component('fixPhoneNumbersItem', Item).name;
