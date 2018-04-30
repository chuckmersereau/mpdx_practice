class ItemController {
    contact: any;
    constructor(
        private blockUI: IBlockUIService,
        private contacts: ContactsService,
        private fixSendNewsletter: FixSendNewsletterService,
        private serverConstants: ServerConstantsService
    ) {}
    $onInit() {
        this.blockUI = this.blockUI.instances.get(`fix-send-newsletter-item-${this.contact.id}`);
    }
    save() {
        this.blockUI.start();
        return this.fixSendNewsletter.save(this.contact).then(() => {
            this.blockUI.reset();
        });
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<'
    }
};

import 'angular-block-ui';
import contacts, { ContactsService } from '../../../../contacts/contacts.service';
import fixSendNewsletter, { FixSendNewsletterService } from '../newsletter.service';
import serverConstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.fix.sendNewsletter.item.component', [
    'blockUI',
    contacts, fixSendNewsletter, serverConstants
]).component('fixSendNewsletterItem', Item).name;
