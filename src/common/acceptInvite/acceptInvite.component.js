import isEmpty from 'lodash/fp/isEmpty';

class AcceptInviteController {
    constructor(
        $state, $stateParams, gettextCatalog,
        alerts, api
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.gettextCatalog = gettextCatalog;
        this.alerts = alerts;
        this.api = api;
    }
    $onInit() {
        if (!isEmpty(this.$stateParams.code)
            && !isEmpty(this.$stateParams.account_list_id)
            && !isEmpty(this.$stateParams.id)
        ) {
            return this.api.put({
                url: `account_lists/${this.$stateParams.account_list_id}/invites/${this.$stateParams.id}/accept`,
                data: {
                    id: this.$stateParams.id,
                    code: this.$stateParams.code
                },
                type: 'account_list_invites'
            }).then(() => {
                this.alerts.addAlert(this.gettextCatalog.getString('Accepted invite to account successfully.'));
                this.$state.go('home');
            }).catch((err) => {
                const message = 'Unable to accept invite. Try asking the account holder to resend the invite.';
                this.alerts.addAlert(this.gettextCatalog.getString(message), 'danger', null, 10);
                this.$state.go('home');
                throw err;
            });
        } else {
            return Promise.reject().catch((err) => {
                const message = 'Unable to accept invite. Try asking the account holder to resend the invite.';
                this.alerts.addAlert(this.gettextCatalog.getString(message), 'danger', null, 10);
                this.$state.go('home');
                throw err;
            });
        }
    }
}

const AcceptInvite = {
    controller: AcceptInviteController,
    template: require('./acceptInvite.html')
};

import uiRouter from '@uirouter/angularjs';
import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';

export default angular.module('mpdx.common.acceptInvite.component', [
    uiRouter, gettextCatalog,
    alerts, api
]).component('acceptInvite', AcceptInvite).name;
