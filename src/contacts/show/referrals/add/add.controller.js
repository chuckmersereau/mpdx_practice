class AddReferralsModalController {
    alertsService;
    api;

    constructor(
        $scope, api, alertsService, contactId
    ) {
        this.$scope = $scope;
        this.alertsService = alertsService;
        this.api = api;
        this.contactId = contactId;

        this.models = {};
    }
    submit() {
        this.api.post(`contacts/${this.contactId}/save_referrals`, { contacts_attributes: this.models }).then((data) => {
            this.$scope.$hide();
            var successMessage;
            var failedMessage;
            var alertType = '';
            if (data.success.length) {
                successMessage = `Successfully added: ${_.map(data.success.map, c => c.greeting).join(', ')}.  `;
                alertType = 'success';
            }
            if (data.failed) {
                failedMessage = `Failed to add ${data.failed} ${data.failed > 1 ? 'referrals!' : 'referral!'}`;
                alertType = 'warning';
            }

            this.alertsService.addAlert(successMessage + failedMessage, alertType, 10000);
        });
    }
}
export default angular.module('mpdx.contacts.show.referrals.add.controller', [])
    .controller('addReferralsModalController', AddReferralsModalController).name;