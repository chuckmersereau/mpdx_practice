class progressController {
    api;
    currentUser;

    constructor(api, $filter, $state, currentUser, gettextCatalog) {
        this.$filter = $filter;
        this.$state = $state;
        this.api = api;
        this.currentUser = currentUser;
        this.gettextCatalog = gettextCatalog;

        this.startDate = new Date();
        this.startDate.setHours(0, 0, 0, 0);
        this.startDate.setDate(this.startDate.getDate() - this.startDate.getDay() + 1);
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.startDate.getDate() + 7);
        this.errorOccurred = false;
    }

    blankData() {
        this.data = {
            contacts: {
                active: '-', referrals_on_hand: '-', referrals: '-'
            },
            phone: {
                completed: '-', attempted: '-', received: '-',
                appointments: '-', talktoinperson: '-'
            },
            email: {
                sent: '-', received: '-'
            },
            facebook: {
                sent: '-', received: '-'
            },
            text_message: {
                sent: '-', received: '-'
            },
            electronic: {
                sent: '-', received: '-', appointments: '-'
            },
            appointments: {
                completed: '-'
            },
            correspondence: {
                precall: '-', support_letters: '-', thank_yous: '-', reminders: '-'
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
        var start_date_string = this.$filter('date')(this.startDate, 'yyyy-MM-dd');
        var url = 'progress.json?start_date=' + start_date_string +
            '&account_list_id=' + this.$state.current_account_list_id;

        this.api.get(url).then((newData) => {
            this.data = newData;
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

import appeals from './appeals/appeals.component';
import appointments from './appointments/appointments.component';
import contacts from './contacts/contacts.component';
import correspondence from './correspondence/correspondence.component';
import electronicContacts from './electronicContacts/electronicContacts.component';
import phoneDials from './phoneDials/phoneDials.component';

export default angular.module('mpdx.home.progress', [
    appeals,
    appointments,
    contacts,
    correspondence,
    electronicContacts,
    phoneDials
]).component('homeProgress', Progress).name;