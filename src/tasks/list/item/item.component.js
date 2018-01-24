import contains from 'lodash/fp/contains';
import pull from 'lodash/fp/pull';

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
        this.watcher = this.$rootScope.$on('taskTagDeleted', (e, data) => {
            if (contains(this.task.id, data.taskIds)) {
                this.task.tag_list = pull(data.tag, this.task.tag_list);
            }
        });
    }
    $onDestroy() {
        this.watcher();
    }
    openContacts() {
        this.onOpen({ $action: 'contacts' });
    }
    openComments() {
        this.onOpen({ $action: 'comments' });
    }
    complete() {
        return this.modal.open({
            template: require('../../modals/complete/complete.html'),
            controller: 'completeTaskController',
            resolve: {
                task: () => this.tasks.load(this.task.id),
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
    select(event) {
        if (event.shiftKey) {
            this.onMultiSelect();
        } else {
            this.onSelect();
        }
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        onOpen: '&',
        onMultiSelect: '&',
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
