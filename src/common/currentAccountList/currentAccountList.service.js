class CurrentAccountList {
    api;
    contacts;
    tasks;

    constructor(api, $log, currentAccountListContacts, currentAccountListTasks) {
        this.api = api;
        this.$log = $log;
        this.contacts = currentAccountListContacts;
        this.tasks = currentAccountListTasks;

        this.donations = {};

        this.get();
    }
    get() {
        return this.api.get('current_account_list').then((resp) => {
            _.extend(this, resp);
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getTasks() {
        return this.api.get('current_account_list/tasks').then((resp) => {
            this.tasks = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getPeopleWithBirthdays() {
        return this.api.get('current_account_list/people_with_birthdays').then((resp) => {
            this.people_with_birthdays = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getContactsWithAnniversaries() {
        return this.api.get('current_account_list/contacts_with_anniversaries').then((resp) => {
            this.contacts_with_anniversaries = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.api.get('current_account_list/donations').then((resp) => {
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
}

import contacts from './contacts.service';
import tasks from './tasks.service';

export default angular.module('mpdx.common.currentAccountList', [
    contacts,
    tasks
]).service('currentAccountList', CurrentAccountList).name;
