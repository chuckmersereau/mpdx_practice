import uuid from 'uuid/v1';

class FieldController {
    constructor(
        fixEmailAddresses, locale
    ) {
        this.fixEmailAddresses = fixEmailAddresses;
        this.locale = locale;
    }

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

import fixEmailAddresses from '../../emailAddresses.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.fix.emailAddresses.item.field.component', [
    fixEmailAddresses, locale
]).component('fixEmailAddressesItemField', Field).name;
