class CareController {
    constructor(
        tasks
    ) {
        this.tasks = tasks;
    }
    addNewsletter() {
        this.tasks.newsletterModal();
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.home.care.component', [
    tasks
]).component('homeCare', Care).name;
