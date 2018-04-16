import { defaultTo } from 'lodash/fp';

class ContactInfoController {
    constructor(
        $state, gettextCatalog,
        contacts, locale, serverConstants, tasks
    ) {
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;
        this.contacts = contacts;
        this.locale = locale;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
    }
    $onInit() {
        const yes = this.gettextCatalog.getString('Yes');
        const no = this.gettextCatalog.getString('No');
        this.translations = {
            pledge_received: [
                { key: true, value: yes },
                { key: false, value: no }
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
    hideContact() {
        this.contacts.hideContact(this.contacts.current).then(() => {
            this.$state.go('contacts');
        });
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

import uiRouter from '@uirouter/angularjs';
import gettextCatalog from 'angular-gettext';
import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.contacts.show.info.component', [
    uiRouter, gettextCatalog,
    contacts, locale, serverConstants, tasks
]).component('contactInfo', Info).name;
