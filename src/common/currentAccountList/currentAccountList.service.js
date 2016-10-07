class CurrentAccountList {
    constructor($http, $log) {
        this.$http = $http;
        this.$log = $log;

        this.contacts = {
            getLatePledgeCount: this.getLatePledgeCount,
            getLatePledgeDays: this.getLatePledgeDays
        };
        this.tasks = {
            getFirstCompleteNewsletter: this.getFirstCompleteNewsletter,
            getTasksOverdueCount: this.getTasksOverdueCount,
            getTasksOverdueGroupByActivityType: this.getTasksOverdueGroupByActivityType
        };
        this.get();
    }

    get() {
        this.$http.get('api/v1/current_account_list').then((resp) => {
            _.extend(this, resp.data);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getTasks() {
        this.$http.get('api/v1/current_account_list/tasks').then((resp) => {
            this.tasks = resp.data;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getPeopleWithBirthdays() {
        this.$http.get('api/v1/current_account_list/people_with_birthdays').then((resp) => {
            this.people_with_birthdays = resp.data;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getContactsWithAniversaries() {
        this.$http.get('api/v1/current_account_list/contacts_with_anniversaries').then((resp) => {
            this.contacts_with_anniversaries = resp.data;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.$http.get('api/v1/current_account_list/donations').then((resp) => {
            this.donations = resp.data;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    //contacts
    getLatePledgeCount() {
        return this.$http.get('api/v1/contacts/late_pledges/count');
    }
    getLatePledgeDays() {
        return this.$http.get('api/v1/contacts/late_pledges/days');
    }
    //tasks
    getTasksOverdueCount() {
        return this.$http.get('api/v1/tasks/overdue_and_today/count');
    }
    getTasksOverdueGroupByActivityType() {
        return this.$http.get('api/v1/tasks/overdue_and_today/group_by_activity_type');
    }
    getFirstCompleteNewsletter() {
        return this.$http.get('api/v1/tasks/newsletters/first_complete');
    }
}

export default angular.module('mpdx.common.currentAccountList', [])
        .service('currentAccountList', CurrentAccountList).name;
