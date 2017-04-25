import concat from 'lodash/fp/concat';
import range from 'lodash/fp/range';
import reduce from 'lodash/fp/reduce';
import uuid from 'uuid/v1';

class MultipleController {
    api;
    contacts;
    constructor(
        $scope,
        api, contacts
    ) {
        this.$scope = $scope;
        this.api = api;
        this.contacts = contacts;
        this.range = range;
    }
    save() {
        const contacts = reduce((result, model) => {
            if (model.first_name || model.last_name) {
                let contact = {
                    id: uuid(),
                    account_list: {id: this.api.account_list_id},
                    name: `${model.last_name}, ${model.first_name}`,
                    notes: model.notes
                };
                let person = {
                    id: uuid(),
                    first_name: model.first_name,
                    last_name: model.last_name
                };
                if (model.email) {
                    person.email_addresses = [{id: uuid(), email: model.email, primary: true}];
                }
                if (model.phone) {
                    person.phone_numbers = [{id: uuid(), number: model.phone, primary: true}];
                }
                contact.people = [person];
                if (model.spouse_first_name) {
                    let spouse = {
                        id: uuid(),
                        first_name: model.spouse_first_name,
                        last_name: model.last_name
                    };
                    contact.name += ` and ${model.spouse_first_name}`;
                    if (model.spouse_phone) {
                        spouse.phone_numbers = [{id: uuid(), number: model.spouse_phone, primary: true}];
                    }
                    if (model.spouse_email) {
                        spouse.email_addresses = [{id: uuid(), email: model.spouse_email, primary: true}];
                    }
                    contact.people = concat(contact.people, spouse);
                }
                if (model.street && model.city && model.state && model.postal_code) {
                    contact.addresses = [{
                        id: uuid(),
                        city: model.city,
                        state: model.state,
                        postal_code: model.postal_code,
                        street: model.street
                    }];
                }

                result = concat(result, contact);
            }
            return result;
        }, [], this.models);
        if (contacts.length === 0) {
            return;
        }
        return this.contacts.addBulk(contacts).then(() => {
            this.$scope.$hide();
        });
    }
}

export default angular.module('mpdx.contacts.multiple.controller', [])
    .controller('multipleContactController', MultipleController).name;