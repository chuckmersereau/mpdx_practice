import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class AddReferralsModalController {
    alerts;
    api;
    contact;
    contacts;

    constructor(
        $scope,
        api, alerts, contacts,
        contact
    ) {
        this.$scope = $scope;
        this.alerts = alerts;
        this.api = api;
        this.contact = contact;
        this.contacts = contacts;

        this.models = {};
    }
    save() {
        const contacts = reduce((result, model) => {
            if (model.first_name || model.last_name) {
                let contact = {
                    id: uuid(),
                    account_list: {id: this.api.account_list_id},
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
            return this.$q.reject();
        }
        return this.contacts.addReferrals(this.contact, contacts).then((data) => {
            this.$scope.$hide();
            return data;
        });
    }
}
export default angular.module('mpdx.contacts.show.referrals.add.controller', [])
    .controller('addReferralsModalController', AddReferralsModalController).name;
