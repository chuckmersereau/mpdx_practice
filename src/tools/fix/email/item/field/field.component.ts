import * as uuid from 'uuid/v1';

class FieldController {
    emailAddress: any;
    person: any;
    constructor(
        private fixEmailAddresses: FixEmailAddressesService
    ) {}
    $onInit() {
        if (!this.emailAddress) {
            this.emailAddress = {
                id: uuid(),
                source: 'MPDX',
                new: true,
                primary: false,
                email: ''
            };
        }
    }
    save() {
        return this.fixEmailAddresses.saveEmailAddress(this.person, this.emailAddress).then(() => {
            if (this.emailAddress.new) {
                this.emailAddress.new = false;
                this.person.email_addresses.push(this.emailAddress);
                this.emailAddress = {
                    id: uuid(),
                    source: 'MPDX',
                    new: true,
                    primary: false,
                    email: ''
                };
            }
        });
    }
    remove() {
        this.fixEmailAddresses.removeEmailAddress(this.person, this.emailAddress);
    }
    setPrimary() {
        this.fixEmailAddresses.setPrimary(this.person, this.emailAddress);
    }
}

const Field = {
    controller: FieldController,
    template: require('./field.html'),
    bindings: {
        person: '<',
        emailAddress: '<'
    }
};

import fixEmailAddresses, { FixEmailAddressesService } from '../../email.service';

export default angular.module('mpdx.tools.fix.emailAddresses.item.field.component', [
    fixEmailAddresses
]).component('fixEmailAddressesItemField', Field).name;
