class AddController {
    constructor(
        appealId, contact,
        $rootScope, $scope, gettext,
        alerts, api, locale, serverConstants
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.alerts = alerts;
        this.api = api;
        this.appealId = appealId;
        this.gettext = gettext;
        this.locale = locale;
        this.serverConstants = serverConstants;

        this.contactId = contact.id;
        this.selectedContact = contact.name;
        this.received = false;
    }
    save() {
        const status = this.received ? 'received_not_processed' : 'not_received';
        const pledge = {
            amount: this.amount,
            expected_date: this.expected_date,
            status: status,
            appeal: {
                id: this.appealId
            },
            contact: {
                id: this.contactId
            }
        };
        return this.api.post(`account_lists/${this.api.account_list_id}/pledges`, pledge).then(() => {
            this.$rootScope.$emit('pledgeAdded', pledge);
            this.alerts.addAlert(this.gettext('Successfully added commitment to appeal'));
            this.$scope.$hide();
        }).catch(() => {
            this.alerts.addAlert(this.gettext('Unable to add commitment to appeal'), 'danger');
        });
    }
}

import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import gettext from 'angular-gettext';
import locale from 'common/locale/locale.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.show.addPledge.controller', [
    gettext,
    alerts, api, locale, serverConstants
]).controller('addPledgeController', AddController).name;