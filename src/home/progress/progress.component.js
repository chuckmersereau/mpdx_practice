import moment from 'moment';

class progressController {
    accounts;
    api;
    users;

    constructor(
        $filter, $rootScope, blockUI,
        accounts, api, users
    ) {
        this.$filter = $filter;
        this.accounts = accounts;
        this.api = api;
        this.blockUI = blockUI.instances.get('homeProgress');
        this.users = users;

        this.endDate = moment().endOf('week').add(1, 'days');
        this.startDate = moment(this.endDate).subtract(1, 'week').add(1, 'day');
        this.errorOccurred = false;

        $rootScope.$on('accountListUpdated', () => {
            this.refreshData();
        });
    }
    blankData() {
        this.blockUI.start();
        this.accounts.analytics = null;
    }
    nextWeek() {
        this.startDate.add(1, 'week');
        this.endDate.add(1, 'week');
        this.refreshData();
    }
    previousWeek() {
        this.startDate.subtract(1, 'week');
        this.endDate.subtract(1, 'week');
        this.refreshData();
    }
    refreshData() {
        this.blankData();
        this.accounts.getAnalytics({startDate: this.startDate, endDate: this.endDate}).then(() => {
            this.blockUI.stop();
        });
    }
    $onInit() {
        this.refreshData();
    }
}

const Progress = {
    controller: progressController,
    template: require('./progress.html')
};

export default angular.module('mpdx.home.progress.component', [])
    .component('homeProgress', Progress).name;
