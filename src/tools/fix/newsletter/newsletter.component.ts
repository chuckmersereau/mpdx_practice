import 'angular-gettext';
import fixSendNewsletter, { FixSendNewsletterService } from './newsletter.service';
import modal, { ModalService } from '../../../common/modal/modal.service';

class NewsletterController {
    watcher: () => void;
    constructor(
        $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private modal: ModalService,
        private fixSendNewsletter: FixSendNewsletterService
    ) {
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onDestroy() {
        this.watcher();
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

const FixNewsletter: ng.IComponentOptions = {
    controller: NewsletterController,
    template: require('./newsletter.html')
};

export default angular.module('mpdx.tools.fixSendNewsletter.component', [
    'gettext',
    modal, fixSendNewsletter
]).component('fixSendNewsletter', FixNewsletter).name;
