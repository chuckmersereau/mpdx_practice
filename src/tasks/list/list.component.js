import concat from 'lodash/fp/concat';
import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';

class ListController {
    constructor(
        $rootScope,
        modal, session, tasks, tasksFilter, tasksTags
    ) {
        this.modal = modal;
        this.session = session;
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;

        $rootScope.$on('taskChange', () => {
            this.tasks.load();
        });

        $rootScope.$on('tasksFilterChange', () => {
            this.tasks.load();
        });

        $rootScope.$on('tasksTagsChanged', () => {
            this.tasks.reset();
        });

        $rootScope.$on('accountListUpdated', () => {
            this.tasksFilter.reset();
            this.tasksFilter.load(true);
            this.tasksTags.load(true);
            this.tasks.reset();
        });
    }
    $onChanges() {
        this.tasks.reset();
    }
    openRemoveTagModal() {
        this.modal.open({
            template: require('../modals/removeTags/removeTags.html'),
            controller: 'removeTaskTagController',
            locals: {
                selectedTasks: this.getSelectedTasks(),
                currentListSize: this.tasks.data.length
            }
        });
    }
    getSelectedTasks() {
        if (this.tasks.selected.length > this.tasks.data.length) {
            return map(id => {
                return {id: id};
            }, this.tasks.selected);
        }
        return reduce((result, task) => {
            if (includes(task.id, this.tasks.selected)) {
                result = concat(result, task);
            }
            return result;
        }, [], this.tasks.data);
    }
}

const TaskList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        contact: '<'
    }
};

import modal from 'common/modal/modal.service';
import session from 'common/session/session.service';
import tasks from '../tasks.service';
import tasksFilter from '../filter/filter.service';
import tasksTags from '../filter/tags/tags.service';

export default angular.module('mpdx.tasks.list.component', [
    modal, session, tasks, tasksFilter, tasksTags
]).component('tasksList', TaskList).name;
