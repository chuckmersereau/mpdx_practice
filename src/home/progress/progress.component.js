class progressController {
    accounts;
    api;
    users;

    constructor(
        blockUI, accounts,
        api, $filter, users
    ) {
        this.$filter = $filter;
        this.accounts = accounts;
        this.api = api;
        this.blockUI = blockUI.instances.get('dashboardProgress');
        this.users = users;

        this.startDate = new Date();
        this.startDate.setHours(0, 0, 0, 0);
        this.startDate.setDate(this.startDate.getDate() - this.startDate.getDay() + 1);
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + 7);
        this.errorOccurred = false;
    }
    blankData() {
        this.blockUI.start();
        this.data = {
            contacts: {
                active: '-', referrals_on_hand: '-', referrals: '-'
            },
            phone: {
                completed: '-',
                attempted: '-',
                received: '-',
                appointments: '-',
                talktoinperson: '-'
            },
            email: {
                sent: '-',
                received: '-'
            },
            facebook: {
                sent: '-',
                received: '-'
            },
            text_message: {
                sent: '-',
                received: '-'
            },
            electronic: {
                sent: '-',
                received: '-',
                appointments: '-'
            },
            appointments: {
                completed: '-'
            },
            correspondence: {
                precall: '-',
                support_letters: '-',
                thank_yous: '-',
                reminders: '-'
            }
        };
    }
    nextWeek() {
        this.startDate.setDate(this.startDate.getDate() + 7);
        this.endDate.setDate(this.endDate.getDate() + 7);
        this.refreshData();
    }
    previousWeek() {
        this.startDate.setDate(this.startDate.getDate() - 7);
        this.endDate.setDate(this.endDate.getDate() - 7);
        this.refreshData();
    }
    refreshData() {
        this.blankData();
        this.accounts.getAnalytics().then(() => {
            this.blockUI.stop();
        });
    }
    $onInit() {
        this.refreshData();
        this.users.getHasAnyUsAccounts();
    }
}

const Progress = {
    controller: progressController,
    template: require('./progress.html')
};

export default angular.module('mpdx.home.progress.component', [])
    .component('homeProgress', Progress).name;
