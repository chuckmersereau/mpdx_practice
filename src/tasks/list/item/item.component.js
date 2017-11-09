import concat from 'lodash/fp/concat';
import contains from 'lodash/fp/contains';
import pull from 'lodash/fp/pull';
import reject from 'lodash/fp/reject';

class ItemController {
    constructor(
        $log, $rootScope, gettextCatalog,
        api, contacts, modal, serverConstants, tasks, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.tasks = tasks;
        this.users = users;
    }
    $onInit() {
        this.showContacts = false;
        this.showComments = false;
        this.loaded = false;

        this.watcher = this.$rootScope.$on('taskTagDeleted', (e, data) => {
            if (contains(this.task.id, data.taskIds)) {
                this.task.tag_list = pull(data.tag, this.task.tag_list);
            }
        });
    }
    $onDestroy() {
        this.watcher();
    }
    toggleContacts() {
        this.showContacts = !this.showContacts;
        if (this.showContacts && !this.loaded) {
            this.load();
        }
    }
    toggleComments() {
        this.showComments = !this.showComments;
        if (this.showComments && !this.loaded) {
            this.load();
        }
    }
    load() {
        return this.api.get(`tasks/${this.task.id}`, {
            include: 'comments,comments.person,contacts,contacts.addresses,contacts.people,contacts.people.facebook_accounts,contacts.people.phone_numbers,contacts.people.email_addresses',
            fields: {
                contacts: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                addresses: 'city,historic,primary_mailing_address,postal_code,state,source,street',
                email_addresses: 'email,historic,primary',
                phone_numbers: 'historic,location,number,primary',
                facebook_accounts: 'username',
                person: 'first_name,last_name,deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers'
            }
        }).then((task) => {
            this.loaded = true;
            this.task = task;
            this.task.contacts = this.contacts.fixPledgeAmountAndFrequencies(task.contacts);
            /* istanbul ignore next */
            this.$log.debug(`tasks/${task.id}`, task);
            return task;
        });
    }
    complete() {
        return this.modal.open({
            template: require('../../modals/complete/complete.html'),
            controller: 'completeTaskController',
            resolve: {
                task: () => this.load(),
                0: () => this.serverConstants.load(['next_actions', 'results', 'status_hashes'])
            }
        });
    }
    star() {
        return this.api.put(`tasks/${this.task.id}`, { id: this.task.id, starred: !this.task.starred }).then((data) => {
            this.task.starred = data.starred;
        });
    }
    edit() {
        return this.modal.open({
            template: require('../../modals/edit/edit.html'),
            controller: 'editTaskController',
            locals: {
                task: this.task
            },
            resolve: {
                0: () => this.serverConstants.load(['activity_hashes', 'results'])
            }
        });
    }
    delete() {
        this.tasks.delete(this.task);
    }
    addComment() {
        if (this.comment) {
            return this.api.post(`tasks/${this.task.id}/comments`, { body: this.comment, person: { id: this.users.current.id } }).then((data) => {
                data.person = {
                    id: this.users.current.id,
                    first_name: this.users.current.first_name,
                    last_name: this.users.current.last_name
                };
                this.task.comments = concat(this.task.comments, data);
                this.comment = '';
            });
        }
    }
    commentRemoved(commentId) {
        this.task.comments = reject({ id: commentId }, this.task.comments);
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        onSelect: '&',
        selected: '<',
        task: '<'
    }
};

import contacts from 'contacts/contacts.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.list.item.component', [
    contacts, tasks
]).component('tasksListItem', Item).name;
