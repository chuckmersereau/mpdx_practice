import 'angular-gettext';
import accounts, { AccountsService } from '../../../../common/accounts/accounts.service';
import alerts, { AlertsService } from '../../../../common/alerts/alerts.service';
import contacts, { ContactsService } from '../../../contacts.service';

class ContactDonorAccountController {
    donorAccount: any;
    onSave: any;
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private accounts: AccountsService,
        private alerts: AlertsService,
        private contacts: ContactsService
    ) {}
    remove() {
        this.donorAccount._destroy = '1';
        this.save();
    }
    save() {
        if (!this.accounts.current) {
            const message = this.gettext('A serious error has occurred. Please refresh your browser or try logging out.');
            this.alerts.addAlert(message, 'danger');
            return;
        }
        if (this.donorAccount.account_number === '') {
            return;
        }
        if (!this.donorAccount.organization_id || this.donorAccount.organization_id === 0) {
            this.donorAccount.organization_id = this.accounts.current.default_organization_id;
        }
        this.onSave();
    }
}
const DonorAccount = {
    controller: ContactDonorAccountController,
    template: require('./donorAccount.html'),
    bindings: {
        contact: '<',
        donorAccount: '=',
        onSave: '&'
    }
};

export default angular.module('mpdx.contacts.show.details.donorAccount.component', [
    'gettext',
    accounts, alerts, contacts
]).component('contactDonorAccount', DonorAccount).name;
