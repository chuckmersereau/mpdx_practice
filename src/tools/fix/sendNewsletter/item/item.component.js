class ItemController {
    constructor(
        blockUI,
        contacts, fixSendNewsletter, serverConstants
    ) {
        this.blockUI = blockUI;
        this.contacts = contacts;
        this.fixSendNewsletter = fixSendNewsletter;
        this.serverConstants = serverConstants;
    }

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

import blockUI from 'angular-block-ui';
import contacts from 'contacts/contacts.service';
import fixSendNewsletter from '../sendNewsletter.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.fix.sendNewsletter.item.component', [
    blockUI,
    contacts, fixSendNewsletter, serverConstants
]).component('fixSendNewsletterItem', Item).name;
