class newsletterController {
    constructor(
        $rootScope, gettextCatalog,
        modal, fixSendNewsletter
    ) {
        this.gettextCatalog = gettextCatalog;

        this.modal = modal;
        this.fixSendNewsletter = fixSendNewsletter;

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

import gettextCatalog from 'angular-gettext';
import modal from 'common/modal/modal.service';
import fixSendNewsletter from './newsletter.service';

export default angular.module('mpdx.tools.fixSendNewsletter.component', [
    gettextCatalog,
    modal, fixSendNewsletter
]).component('fixSendNewsletter', Fixnewsletter).name;
