class CurrentAccountList {
    api;
    contacts;
    donations;
    tasks;

    constructor(api, $log, currentAccountListContacts, currentAccountListTasks) {
        this.api = api;
        this.$log = $log;
        this.contacts = currentAccountListContacts;
        this.tasks = currentAccountListTasks;

        this.analytics = null;
        this.donations = {};

        this.get();
    }
    get() {
        return this.api.get(`account_lists/${this.api.account_list_id}`).then((resp) => {
            _.extend(this, resp);
            this.api.account_list_id = this.account_list.id;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getTasks() {
        return this.api.get('tasks').then((resp) => {
            this.tasks = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getDonations() {
        return this.api.get(`accounts/${this.api.account_list_id}/donations`).then((resp) => {
            this.donations = resp;
        }).catch((err) => {
            this.$log.debug(err);
        });
    }
    getAnalytics() {
        if (this.analytics) {
            return this.$q.resolve(this.analytics);
        }
        return this.api.get('accounts/analytics').then((data) => {
            console.log(data);
            this.analytics = data;
            return this.analytics;
        });
    }
}

import contacts from './contacts.service';
import tasks from './tasks.service';

export default angular.module('mpdx.common.currentAccountList', [
    contacts,
    tasks
]).service('currentAccountList', CurrentAccountList).name;
