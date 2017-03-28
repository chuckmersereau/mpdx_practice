class AddController {
    constructor(
        tasks
    ) {
        this.tasks = tasks;
        this.task = {};
    }
    save() {
        const task = angular.copy(this.task);
        this.task = {};
        this.tasks.create(task);
    }
}

const Add = {
    controller: AddController,
    template: require('./add.html')
};

export default angular.module('mpdx.tasks.list.add.component', [])
    .component('tasksListAdd', Add).name;
