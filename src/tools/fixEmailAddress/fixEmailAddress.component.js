class FixEmailAddressController {
    fixPhone;
    fixEmailAddress;
    fixMailingAddress;
    serverConstants;

    constructor(
        fixPhone, fixEmailAddress, fixMailingAddress, serverConstants
    ) {
        this.fixPhone = fixPhone;
        this.fixEmailAddress = fixEmailAddress;
        this.fixMailingAddress = fixMailingAddress;
        this.serverConstants = serverConstants;

        this.bulkSource = this.serverConstants.data.sources.email_addresses[0];
        this.showBulkAlert = false;
    }

    bulkSave() {
        return this.fixEmailAddress.bulkSave(this.bulkSource).then(() => {
            this.showBulkAlert = false;

            this.fixEmailAddress.load(true);
        });
    }
}

const FixEmailAddress = {
    controller: FixEmailAddressController,
    template: require('./fixEmailAddress.html')
};

export default angular.module('mpdx.tools.fixEmailAddress.component', [])
    .component('fixEmailAddress', FixEmailAddress).name;