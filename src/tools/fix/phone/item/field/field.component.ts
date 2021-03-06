import * as uuid from 'uuid/v1';
import fixPhoneNumbers, { FixPhoneNumbersService } from '../../phone.service';

class FieldController {
    person: any;
    phoneNumber: any;
    constructor(
        private fixPhoneNumbers: FixPhoneNumbersService
    ) {}
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

const Field: ng.IComponentOptions = {
    controller: FieldController,
    template: require('./field.html'),
    bindings: {
        person: '<',
        phoneNumber: '<'
    }
};

export default angular.module('mpdx.tools.fix.phoneNumbers.item.field.component', [
    fixPhoneNumbers
]).component('fixPhoneNumbersItemField', Field).name;
