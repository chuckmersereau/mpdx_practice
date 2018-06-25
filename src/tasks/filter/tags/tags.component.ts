import { isNil } from 'lodash/fp';
import tasksTags, { TasksTagsService } from './tags.service';
import users, { UsersService } from '../../../common/users/users.service';

class TagsController {
    hideTags: boolean;
    isCollapsed: boolean;
    watcher: () => void;
    constructor(
        private $scope: ng.IScope,
        private users: UsersService,
        private tasksTags: TasksTagsService
    ) {
        this.hideTags = true;
    }
    $onInit() {
        this.isCollapsed = this.users.getCurrentOptionValue('tasks_tags_collapse');
        this.watcher = this.$scope.$watch('$ctrl.isCollapsed', (newVal) => {
            if (!isNil(newVal)) {
                this.users.saveOption('tasks_tags_collapse', this.isCollapsed);
            }
        });
    }
    $onDestroy() {
        this.watcher();
    }
}

const Tags = {
    controller: TagsController,
    template: require('./tags.html')
};

export default angular.module('mpdx.tasks.tags', [
    tasksTags, users
]).component('tasksTags', Tags).name;
