import contacts, { ContactsService } from '../../contacts.service';
import tasksFilter, { TasksFilterService } from '../../../tasks/filter/filter.service';

class ContactTasksController {
    constructor(
        private contacts: ContactsService,
        private tasksFilter: TasksFilterService
    ) {}
    $onInit() {
        this.tasksFilter.params = { contact_ids: this.contacts.current.id };
        this.tasksFilter.assignDefaultParamsAndGroup('contact');
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: ContactTasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.contacts.show.tasks.component', [
    contacts, tasksFilter
]).component('contactTasks', Tasks).name;
