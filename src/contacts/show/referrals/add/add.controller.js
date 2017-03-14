import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class AddReferralsModalController {
    alerts;
    api;
    contacts;

    constructor(
        $scope,
        api, alerts, contacts,
        contactId
    ) {
        this.$scope = $scope;
        this.alerts = alerts;
        this.api = api;
        this.contactId = contactId;
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
            return;
        }
        return this.contacts.addReferrals(this.contactId, contacts).then((data) => {
            this.$scope.$hide();
            console.log(data);
            // let successMessage;
            // let failedMessage;
            // let alertType = '';
            // if (data.success.length) {
            //     successMessage = `Successfully added: ${_.map(data.success.map, c => c.greeting).join(', ')}.  `;
            //     alertType = 'success';
            // }
            // if (data.failed) {
            //     failedMessage = `Failed to add ${data.failed} ${data.failed > 1 ? 'referrals!' : 'referral!'}`;
            //     alertType = 'warning';
            // }
            //
            // this.alerts.addAlert(successMessage + failedMessage, alertType, 10000);
        });
    }
}
export default angular.module('mpdx.contacts.show.referrals.add.controller', [])
    .controller('addReferralsModalController', AddReferralsModalController).name;
