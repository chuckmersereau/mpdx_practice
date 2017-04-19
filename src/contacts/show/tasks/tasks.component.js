class ContactTasksController {
    constructor(
        contacts, tasksFilter
    ) {
        this.contacts = contacts;
        this.tasksFilter = tasksFilter;
    }
    $onInit() {
        this.tasksFilter.params = { contact_ids: this.contacts.current.id };
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: ContactTasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.contacts.show.tasks.component', [])
    .component('contactTasks', Tasks).name;
