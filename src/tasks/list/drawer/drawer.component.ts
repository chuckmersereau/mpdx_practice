import { concat, get, reject } from 'lodash/fp';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import tasks, { TasksService } from '../../tasks.service';
import users, { UsersService } from '../../../common/users/users.service';

class DrawerController {
    comment: any;
    loaded: boolean;
    task: any;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private gettext: ng.gettext.gettextFunction,
        private tasks: TasksService,
        private users: UsersService
    ) {
        this.loaded = false;
    }
    $onChanges(changes) {
        const taskId = get('id', this.task);
        const task = get('task', changes);
        if (taskId !== get('id', task.previousValue)) {
            this.loaded = false;
            return this.tasks.load(this.task.id).then((task) => {
                this.task = task;
                this.loaded = true;
            }).catch(() => {
                const msg = this.gettext('Unable to load requested task');
                this.alerts.addAlert(msg, 'danger');
            });
        }
    }
    addComment() {
        if (this.comment) {
            return this.api.post(`tasks/${this.task.id}/comments`, { body: this.comment, person: { id: this.users.current.id } }).then((data: any) => {
                data.person = {
                    id: this.users.current.id,
                    first_name: this.users.current.first_name,
                    last_name: this.users.current.last_name
                };
                this.task.comments = concat(this.task.comments, data);
                this.comment = '';
                this.$rootScope.$emit('taskCommentsChanged', this.task);
            });
        }
    }
    commentRemoved(commentId) {
        this.task.comments = reject({ id: commentId }, this.task.comments);
        this.$rootScope.$emit('taskCommentsChanged', this.task);
    }
}

const Drawer = {
    template: require('./drawer.html'),
    controller: DrawerController,
    bindings: {
        view: '<',
        task: '<'
    }
};

export default angular.module('mpdx.tasks.list.drawer.component', [
    api, alerts, contacts, tasks, users
]).component('taskItemDrawer', Drawer).name;
