import defaultTo from 'lodash/fp/defaultTo';

class ContactInfoController {
    contact;
    contacts;
    serverConstants;

    constructor(
        gettextCatalog,
        contacts, locale, serverConstants
    ) {
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.locale = locale;
        this.serverConstants = serverConstants;
    }
    $onInit() {
        const yes = this.gettextCatalog.getString('Yes');
        const no = this.gettextCatalog.getString('No');
        this.translations = {
            pledge_received: [
                {key: true, value: yes},
                {key: false, value: no}
            ]
        };
    }
    $onChanges(obj) {
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

import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.contacts.show.info.component', [
    contacts, locale, serverConstants
]).component('contactInfo', Info).name;
