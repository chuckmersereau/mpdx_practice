import * as uuid from 'uuid/v1';
import { reduce } from 'lodash/fp';
import { StateParams, StateService } from '@uirouter/core';
import api, { ApiService } from '../../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts.service';
import uiRouter from '@uirouter/angularjs';

class AddReferralsModalController {
    models: any;
    constructor(
        private $q: ng.IQService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $state: StateService,
        private $stateParams: StateParams,
        private api: ApiService,
        private contacts: ContactsService,
        private contact: any
    ) {
        this.models = {};
    }
    save() {
        const contacts = reduce((result, model) => {
            if (model.first_name || model.last_name) {
                let contact: any = {
                    id: uuid(),
                    account_list: { id: this.api.account_list_id },
                    primary_person_first_name: model.first_name,
                    primary_person_last_name: model.last_name,
                    name: `${model.last_name}, ${model.first_name}`,
                    notes: model.notes
                };
                if (model.spouse_first_name) {
                    contact.spouse_first_name = model.spouse_first_name;
                    contact.spouse_last_name = model.last_name;
                    contact.name += ` and ${model.spouse_first_name}`;
                    if (model.spouse_phone) {
                        contact.spouse_phone = model.spouse_phone;
                    }
                    if (model.spouse_email) {
                        contact.spouse_email = model.spouse_email;
                    }
                }
                if (model.street && model.city && model.state && model.postal_code) {
                    contact.primary_address_city = model.city;
                    contact.primary_address_state = model.state;
                    contact.primary_address_postal_code = model.postal_code;
                    contact.primary_address_street = model.street;
                }
                if (model.email) {
                    contact.primary_person_email = model.email;
                }
                if (model.phone) {
                    contact.primary_person_phone = model.phone;
                }
                result.push(contact);
            }
            return result;
        }, [], this.models);
        if (contacts.length === 0) {
            return this.$q.reject('');
        }
        return this.contacts.addReferrals(this.contact, contacts).then((data) => {
            this.$scope.$hide();
            this.$state.go('contacts', { filters: { referrer: this.$stateParams.contactId } });
            return data;
        });
    }
}

export default angular.module('mpdx.contacts.show.referrals.add.controller', [
    uiRouter,
    api, contacts
]).controller('addReferralsModalController', AddReferralsModalController).name;
