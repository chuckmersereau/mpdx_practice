import 'angular-gettext';
import { defaultTo } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import modal, { ModalService } from '../../../common/modal/modal.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../../tasks/tasks.service';
import uiRouter from '@uirouter/angularjs';

class ContactInfoController {
    contact: any;
    onSave: any;
    constructor(
        private $state: StateService,
        private api: ApiService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contacts: ContactsService,
        private locale: LocaleService,
        private modal: ModalService,
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
    hideContact(): ng.IPromise<void> {
        return this.contacts.hideContact(this.contacts.current).then(() => {
            this.$state.go('contacts');
        });
    }
    save(): void {
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

export default angular.module('mpdx.contacts.show.info.component', [
    uiRouter, 'gettext',
    api, contacts, locale, modal, serverConstants, tasks
]).component('contactInfo', Info).name;
