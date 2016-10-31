class CurrentAccountList {
    api;

    constructor(api, $log) {
        this.api = api;
        this.$log = $log;

        this.donations = {};

        this.contacts = {
            getLatePledgeCount: this.getLatePledgeCount.bind(this),
            getLatePledgeDays: this.getLatePledgeDays.bind(this)
        };
        this.tasks = {
            getFirstCompleteNewsletter: this.getFirstCompleteNewsletter.bind(this),
            getTasksOverdueCount: this.getTasksOverdueCount.bind(this),
            getTasksOverdueGroupByActivityType: this.getTasksOverdueGroupByActivityType.bind(this)
        };
        this.get();
    }
    get() {
        this.api.get('current_account_list').then((resp) => {
            _.extend(this, resp);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getTasks() {
        this.api.get('current_account_list/tasks').then((resp) => {
            this.tasks = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getPeopleWithBirthdays() {
        this.api.get('current_account_list/people_with_birthdays').then((resp) => {
            this.people_with_birthdays = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getContactsWithAnniversaries() {
        this.api.get('current_account_list/contacts_with_anniversaries').then((resp) => {
            this.contacts_with_anniversaries = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.api.get('current_account_list/donations').then((resp) => {
            //console.log(resp);
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    //contacts
    getLatePledgeCount() {
        return this.api.get('contacts/late_pledges/count');
    }
    getLatePledgeDays() {
        return this.api.get('contacts/late_pledges/days');
    }
    //tasks
    getTasksOverdueCount() {
        return this.api.get('tasks/overdue_and_today/count');
    }
    getTasksOverdueGroupByActivityType() {
        return this.api.get('tasks/overdue_and_today/group_by_activity_type');
    }
    getFirstCompleteNewsletter() {
        return this.api.get('tasks/newsletters/first_complete');
    }
}

export default angular.module('mpdx.common.currentAccountList', [])
        .service('currentAccountList', CurrentAccountList).name;
