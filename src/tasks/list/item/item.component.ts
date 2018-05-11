import { ApiService } from '../../../common/api/api.service';
import { contains, includes, pull, union } from 'lodash/fp';
import { ModalService } from '../../../common/modal/modal.service';
import { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import { UsersService } from '../../../common/users/users.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import tasks, { TasksService } from '../../tasks.service';

class ItemController {
    onMultiSelect: any;
    onOpen: any;
    onSelect: any;
    task: any;
    watcher: any;
    watcher2: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private contacts: ContactsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService,
        private users: UsersService
    ) {}
    $onInit() {
        this.watcher = this.$rootScope.$on('taskTagDeleted', (e, data) => {
            if (contains(this.task.id, data.taskIds)) {
                this.task.tag_list = pull(data.tag, this.task.tag_list);
            }
        });

        this.watcher2 = this.$rootScope.$on('taskTagsAdded', (e, val) => {
            if (!val.taskIds || includes(this.task.id, val.taskIds)) {
                this.task.tag_list = union(this.task.tag_list, val.tags);
            }
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
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
        return this.api.put(`tasks/${this.task.id}`, { id: this.task.id, starred: !this.task.starred }).then((data: any) => {
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

export default angular.module('mpdx.tasks.list.item.component', [
    contacts, tasks
]).component('tasksListItem', Item).name;
