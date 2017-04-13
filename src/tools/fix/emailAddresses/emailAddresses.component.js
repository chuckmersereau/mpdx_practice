class EmailAddressesController {
    fixEmailAddresses;

    constructor(
        gettextCatalog, blockUI,
        modal, fixEmailAddresses
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-emailAddresses');

        this.modal = modal;
        this.fixEmailAddresses = fixEmailAddresses;
        this.source = 'MPDX';
    }

    save() {
        const message = this.gettextCatalog.getString("You are updating all visible contacts to set the first {{source}} email address as the primary email address. If no such email address exists the contact will not be updated. Are you sure you want to do this?", { source: this.source });
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixEmailAddresses.bulkSave(this.source).finally(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page) {
        this.fixEmailAddresses.load(true, page);
    }
}

const EmailAddresses = {
    controller: EmailAddressesController,
    template: require('./emailAddresses.html')
};

export default angular.module('mpdx.tools.fix.emailAddresses.component', [])
    .component('fixEmailAddresses', EmailAddresses).name;
