import api, { ApiService } from '../../../../common/api/api.service';
import modal, { ModalService } from '../../../../common/modal/modal.service';
import serverconstants, { ServerConstantsService } from '../../../../common/serverConstants/serverConstants.service';

export class GoogleIntegrationsService {
    constructor(
        private $log: ng.ILogService,
        private api: ApiService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService
    ) {}
    get(googleAccount) {
        return this.api.get(`user/google_accounts/${googleAccount.id}/google_integrations`, {
            filter: { account_list_id: this.api.account_list_id }
        }).then((data: any) => {
            if (data.length > 0) {
                this.$log.debug(`user/google_accounts/${googleAccount.id}/google_integrations`, data[0]);
                return data[0];
            } else {
                return this.create(googleAccount);
            }
        });
    }
    create(googleAccount, googleIntegration: any = {}) {
        googleIntegration.account_list = { id: this.api.account_list_id };
        return this.api.post({
            url: `user/google_accounts/${googleAccount.id}/google_integrations`,
            data: googleIntegration,
            type: 'google_integrations'
        }).then((data) => {
            this.$log.debug(`user/google_accounts/${googleAccount.id}/google_integrations`, data);
            return data;
        });
    }
    save(googleAccount, googleIntegration) {
        return this.api.put({
            url: `user/google_accounts/${googleAccount.id}/google_integrations/${googleIntegration.id}`,
            data: googleIntegration,
            type: 'google_integrations'
        });
    }
    delete(id) {
        return this.api.delete({ url: `user/google_integrations/${id}`, type: 'google_integrations' }).then(() => {
        });
    }
    sync(googleAccount, googleIntegration, integrationName) {
        return this.api.get(`user/google_accounts/${googleAccount.id}/google_integrations/${googleIntegration.id}/sync?integration=${integrationName}`);
    }
    enable(googleAccount, googleIntegration, integrationName) {
        let current = { id: googleIntegration.id };
        current[`${integrationName}_integration`] = true;
        return this.save(googleAccount, current);
    }
    disable(googleAccount, googleIntegration, integrationName) {
        let current = { id: googleIntegration.id };
        current[`${integrationName}_integration`] = false;
        return this.save(googleAccount, current);
    }
    openModal(googleAccount) {
        return this.modal.open({
            template: require('./integrations.html'),
            controller: 'googleIntegrationsModalController',
            resolve: {
                googleIntegration: () => this.get(googleAccount),
                0: () => this.serverConstants.load(['activity_hashes'])
            },
            locals: {
                googleAccount: googleAccount
            }
        });
    }
}

export default angular.module('mpdx.preferences.accounts.integrations.google.integrations.service', [
    api, modal, serverconstants
]).service('googleIntegrations', GoogleIntegrationsService).name;
