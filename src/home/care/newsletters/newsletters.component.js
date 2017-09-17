class NewslettersController {
    constructor(
        tasks
    ) {
        this.tasks = tasks;
    }
}

const Newsletters = {
    controller: NewslettersController,
    template: require('./newsletters.html')
};

import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.home.care.newsletters', [
    tasks
]).component('newsletters', Newsletters).name;
