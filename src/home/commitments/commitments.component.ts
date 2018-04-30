class CommitmentsController {
    analytics: any;
    blockUI: IBlockUIService;
    watcher: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        blockUI: IBlockUIService,
        private api: ApiService
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;

        this.blockUI = blockUI.instances.get('commitments');
    }
    $onInit() {
        this.load();
        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onDestroy() {
        this.watcher();
    }
    load() {
        this.blockUI.start();
        return this.getAnalytics().then((data) => {
            this.analytics = data;
            this.blockUI.reset();
        });
    }
    getAnalytics() {
        return this.api.get({
            url: 'contacts/analytics',
            data: {
                filter: { account_list_id: this.api.account_list_id }
            },
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('contacts/analytics', data);
            return data;
        });
    }
}

import api, { ApiService } from '../../common/api/api.service';
import 'angular-block-ui';

const Commitments = {
    template: require('./commitments.html'),
    controller: CommitmentsController
};

export default angular.module('mpdx.home.commitments', [
    'blockUI',
    api
]).component('homeCommitments', Commitments).name;
