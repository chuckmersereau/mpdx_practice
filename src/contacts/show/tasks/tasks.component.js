class ContactTasksController {
    constructor(
        contacts, tasksFilter
    ) {
        this.contacts = contacts;
        this.tasksFilter = tasksFilter;
    }
    $onInit() {
        this.tasksFilter.params = { contact_ids: this.contacts.current.id };
        this.tasksFilter.assignDefaultParamsAndGroup('all');
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: ContactTasksController,
    template: require('./tasks.html')
};

import contacts from '../../contacts.service';
import tasksFilter from '../../../tasks/filter/filter.service';

export default angular.module('mpdx.contacts.show.tasks.component', [
    contacts, tasksFilter
]).component('contactTasks', Tasks).name;
