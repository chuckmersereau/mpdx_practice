import uuid from 'uuid/v1';

class FieldController {
    fixPhoneNumbers;
    locale;

    constructor(
        $q,
        fixPhoneNumbers, locale
    ) {
        this.$q = $q;

        this.fixPhoneNumbers = fixPhoneNumbers;
        this.locale = locale;
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

    remove() {
        this.fixPhoneNumbers.removePhoneNumber(this.person, this.phoneNumber);
    }

    save() {
        this.fixPhoneNumbers.savePhoneNumber(this.person, this.phoneNumber).then(() => {
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

export default angular.module('mpdx.tools.fix.phoneNumbers.item.field.component', [])
    .component('fixPhoneNumbersItemField', Field).name;
