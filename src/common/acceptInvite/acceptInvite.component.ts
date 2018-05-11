import 'angular-gettext';
import { AlertsService } from '../alerts/alerts.service';
import { ApiService } from '../api/api.service';
import { isEmpty } from 'lodash/fp';
import { StateParams, StateService } from '@uirouter/core';
import alerts from '../../common/alerts/alerts.service';
import api from '../../common/api/api.service';
import uiRouter from '@uirouter/angularjs';

class AcceptInviteController {
    constructor(
        private $q: ng.IQService,
        private $state: StateService,
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService
    ) { }
    $onInit() {
        const errorMessage = this.gettextCatalog.getString('Unable to accept invite. Try asking the account holder to resend the invite.');
        if (!isEmpty(this.$stateParams.code)
            && !isEmpty(this.$stateParams.account_list_id)
            && !isEmpty(this.$stateParams.id)
        ) {
            const successMessage = this.gettextCatalog.getString('Accepted invite to account successfully.');
            return this.api.put({
                url: `account_lists/${this.$stateParams.account_list_id}/invites/${this.$stateParams.id}/accept`,
                data: {
                    id: this.$stateParams.id,
                    code: this.$stateParams.code
                },
                type: 'account_list_invites',
                errorMessage: errorMessage,
                successMessage: successMessage
            }).then(() => {
                this.$state.go('home');
            }).catch((err) => {
                this.$state.go('home');
                throw err;
            });
        } else {
            return this.$q.reject('').catch((err) => {
                this.alerts.addAlert(errorMessage, 'danger', 10);
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

export default angular.module('mpdx.common.acceptInvite.component', [
    uiRouter, 'gettext',
    alerts, api
]).component('acceptInvite', AcceptInvite).name;
