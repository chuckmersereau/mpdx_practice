class newsletterController {
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private modal: ModalService,
        private fixSendNewsletter: FixSendNewsletterService
    ) {
        $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    save() {
        const message = this.gettextCatalog.getString(
            `You are updating all contacts visible on this page, setting it to the visible newsletter selection.
            Are you sure you want to do this?`
        );
        return this.modal.confirm(message).then(() => {
            return this.fixSendNewsletter.bulkSave();
        });
    }
    load(page = null) {
        return this.fixSendNewsletter.load(true, page);
    }
}

const Fixnewsletter = {
    controller: newsletterController,
    template: require('./newsletter.html')
};

import 'angular-gettext';
import modal, { ModalService } from '../../../common/modal/modal.service';
import fixSendNewsletter, { FixSendNewsletterService } from './newsletter.service';

export default angular.module('mpdx.tools.fixSendNewsletter.component', [
    'gettext',
    modal, fixSendNewsletter
]).component('fixSendNewsletter', Fixnewsletter).name;
