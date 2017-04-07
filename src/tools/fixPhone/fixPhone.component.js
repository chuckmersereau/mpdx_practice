class FixPhoneController {
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

        this.bulkSource = this.serverConstants.data.sources.phone_numbers[0];
        this.showBulkAlert = false;
    }

    bulkSave() {
        return this.fixPhone.bulkSave(this.bulkSource).then(() => {
            this.showBulkAlert = false;

            this.fixPhone.load(true);
        });
    }
}

const FixPhone = {
    controller: FixPhoneController,
    template: require('./fixPhone.html')
};

export default angular.module('mpdx.tools.fixPhone.component', [])
    .component('fixPhone', FixPhone).name;