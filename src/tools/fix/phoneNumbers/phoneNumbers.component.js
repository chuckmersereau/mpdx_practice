class PhoneNumbersController {
    fixPhoneNumbers;

    constructor(
        gettextCatalog, blockUI,
        modal, fixPhoneNumbers
    ) {
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('fix-phoneNumbers');

        this.modal = modal;
        this.fixPhoneNumbers = fixPhoneNumbers;
        this.source = 'MPDX';
    }

    save() {
        const message = this.gettextCatalog.getString("You are updating all visible contacts to set the first {{source}} phone number as the primary phone number. If no such phone number exists the contact will not be updated. Are you sure you want to do this?", { source: this.source });
        return this.modal.confirm(message).then(() => {
            this.blockUI.start();
            return this.fixPhoneNumbers.bulkSave(this.source).finally(() => {
                this.blockUI.reset();
            });
        });
    }

    load(page) {
        this.fixPhoneNumbers.load(true, page);
    }
}

const PhoneNumbers = {
    controller: PhoneNumbersController,
    template: require('./phoneNumbers.html')
};

export default angular.module('mpdx.tools.fix.phoneNumbers.component', [])
    .component('fixPhoneNumbers', PhoneNumbers).name;
