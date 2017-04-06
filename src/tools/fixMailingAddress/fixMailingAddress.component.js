class FixMailingAddressController {
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

        this.bulkSource = this.serverConstants.data.sources.addresses[0];
        this.showBulkAlert = false;
    }

    bulkSave() {
        return this.fixMailingAddress.bulkSave(this.bulkSource).then(() => {
            this.showBulkAlert = false;

            this.fixMailingAddress.load(true);
        });
    }
}

const FixMailingAddress = {
    controller: FixMailingAddressController,
    template: require('./fixMailingAddress.html')
};

export default angular.module('mpdx.tools.fixMailingAddress.component', [])
    .component('fixMailingAddress', FixMailingAddress).name;