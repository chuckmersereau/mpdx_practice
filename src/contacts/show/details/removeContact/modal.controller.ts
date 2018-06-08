import '@uirouter/angularjs';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts.service';

class HideController {
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $state: StateService,
        private api: ApiService,
        private contacts: ContactsService
    ) {}
    removeContact() {
        return this.api.delete({
            url: `contacts/${this.contacts.current.id}`,
            type: 'contact'
        }).then(() => {
            this.$scope.$hide();
            this.$state.go('contacts');
        });
    }
    hideContact() {
        this.$scope.$hide();
        this.contacts.hideContact(this.contacts.current);
    }
}

export default angular.module('mpdx.contacts.show.details.removeContact.modal.controller', [
    'ui.router',
    api, contacts
]).controller('removeContactModalController', HideController).name;