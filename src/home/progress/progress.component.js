class progressController {
    api;
    currentUser;
    state;

    constructor(
        blockUI,
        api, $filter, state, currentUser
    ) {
        this.$filter = $filter;
        this.state = state;
        this.api = api;
        this.blockUI = blockUI.instances.get('dashboardProgress');
        this.currentUser = currentUser;

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
        let startDateString = this.$filter('date')(this.startDate, 'yyyy-MM-dd');
        const url = 'progress.json?start_date=' + startDateString +
            '&account_list_id=' + this.state.current_account_list_id;

        this.api.get(url).then((newData) => {
            this.data = newData;
            this.blockUI.stop();
        }).catch(() => {
            this.errorOccurred = true;
        });
    }
    $onInit() {
        this.refreshData();
        this.currentUser.getHasAnyUsAccounts();
    }
}

const Progress = {
    controller: progressController,
    template: require('./progress.html')
};

export default angular.module('mpdx.home.progress.component', [])
    .component('homeProgress', Progress).name;