import 'angular-block-ui';
import { get } from 'lodash/fp';
import fixEmailAddresses, { FixEmailAddressesService } from '../email.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import people, { PeopleService } from '../../../../contacts/show/people/people.service';

class ItemController {
    blockUI: IBlockUIService;
    person: any;
    constructor(
        private $scope: ng.IScope,
        blockUI: IBlockUIService,
        private fixEmailAddresses: FixEmailAddressesService,
        private modal: ModalService,
        private people: PeopleService
    ) {
        this.blockUI = blockUI.instances.get(`fix-email-addresses-item-${$scope.$id}`);
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

export default angular.module('mpdx.tools.fix.emailAddresses.item.component', [
    'blockUI',
    fixEmailAddresses, modal, people
]).component('fixEmailAddressesItem', Item).name;
