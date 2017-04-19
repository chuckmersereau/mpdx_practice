import defaultTo from 'lodash/fp/defaultTo';

class ContactInfoController {
    contact;
    contacts;
    serverConstants;

    constructor(
        contacts, locale, serverConstants
    ) {
        this.contacts = contacts;
        this.locale = locale;
        this.serverConstants = serverConstants;
    }
    $onChange(obj) {
        if (obj.contact) {
            if (parseInt(obj.contact.currentValue.pledge_frequency) > 0) {
                this.contact.pledge_frequency = obj.contact.currentValue.pledge_frequency + '.0';
            }
        }
    }
    saveWithEmptyCheck(property) {
        this.contact[property] = defaultTo('', this.contact[property]);
        this.save();
    }
    save() {
        this.onSave();
    }
}
const Info = {
    controller: ContactInfoController,
    template: require('./info.html'),
    bindings: {
        contact: '=',
        onSave: '&'
    }
};

export default angular.module('mpdx.contacts.show.info.component', [])
    .component('contactInfo', Info).name;
