import uuid from 'uuid/v1';

class FieldController {
    constructor(
        fixPhoneNumbers
    ) {
        this.fixPhoneNumbers = fixPhoneNumbers;
    }
    $onInit() {
        if (!this.phoneNumber) {
            this.phoneNumber = {
                id: uuid(),
                source: 'MPDX',
                new: true,
                primary: false,
                number: ''
            };
        }
    }
    save() {
        return this.fixPhoneNumbers.savePhoneNumber(this.person, this.phoneNumber).then(() => {
            if (this.phoneNumber.new) {
                this.phoneNumber.new = false;
                this.person.phone_numbers.push(this.phoneNumber);
                this.phoneNumber = {
                    id: uuid(),
                    source: 'MPDX',
                    new: true,
                    primary: false,
                    number: ''
                };
            }
        });
    }
    remove() {
        this.fixPhoneNumbers.removePhoneNumber(this.person, this.phoneNumber);
    }
    setPrimary() {
        this.fixPhoneNumbers.setPrimary(this.person, this.phoneNumber);
    }
}

const Field = {
    controller: FieldController,
    template: require('./field.html'),
    bindings: {
        person: '<',
        phoneNumber: '<'
    }
};

import fixPhoneNumbers from '../../phoneNumbers.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.fix.phoneNumbers.item.field.component', [
    fixPhoneNumbers, locale
]).component('fixPhoneNumbersItemField', Field).name;
