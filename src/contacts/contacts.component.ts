import { StateParams, StateService } from '@uirouter/core';

class ContactsController {
    selected: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private contactFilter: ContactFilterService,
        private help: HelpService,
        private session: SessionService
    ) {}
    $onInit() {
        this.help.suggest([
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('5841bd789033600698175e62'),
            this.gettextCatalog.getString('584715b890336006981774d2'),
            this.gettextCatalog.getString('5845aab3c6979106d373a576'),
            this.gettextCatalog.getString('58471fd6903360069817752e'),
            this.gettextCatalog.getString('5845ac509033600698176a62'),
            this.gettextCatalog.getString('5845abb0c6979106d373a57b'),
            this.gettextCatalog.getString('5845984f90336006981769a1'),
            this.gettextCatalog.getString('584597e6903360069817699d'),
            this.gettextCatalog.getString('5845af809033600698176a8c'),
            this.gettextCatalog.getString('5845acfcc6979106d373a580'),
            this.gettextCatalog.getString('5845ad8c9033600698176a6e')
        ]);

        this.selected = this.$stateParams.contactId;
        this.session.navSecondary = true;
    }
    $onDestroy() {
        this.session.navSecondary = false;
    }
}

const Contacts = {
    controller: ContactsController,
    template: require('./contacts.html')
};

import 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import contactFilter, { ContactFilterService } from './sidebar/filter/filter.service';
import help, { HelpService } from '../common/help/help.service';
import session, { SessionService } from '../common/session/session.service';

export default angular.module('mpdx.contacts.component', [
    'gettext', uiRouter,
    contactFilter, help, session
]).component('contacts', Contacts).name;
