class ContactTasksController {
    constructor(tasksFilter) {
        this.tasksFilter = tasksFilter;
    }
    $onInit() {
        this.tasksFilter.params = { contact_ids: this.contact.id };
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: ContactTasksController,
    template: require('./tasks.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.tasks.component', [])
    .component('contactTasks', Tasks).name;
