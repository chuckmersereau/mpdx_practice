import { defaultTo } from 'lodash/fp';

class ContactInfoController {
    contact: any;
    onSave: any;
    constructor(
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contacts: ContactsService,
        private locale: LocaleService,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService
    ) {}
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
        return this.contacts.hideContact(this.contacts.current).then(() => {
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
import 'angular-gettext';
import contacts, { ContactsService } from '../../contacts.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../../tasks/tasks.service';
import { StateService } from '@uirouter/core';

export default angular.module('mpdx.contacts.show.info.component', [
    uiRouter, 'gettext',
    contacts, locale, serverConstants, tasks
]).component('contactInfo', Info).name;
