import tasks, { TasksService } from '../../../tasks/tasks.service';

class NewslettersController {
    constructor(
        private tasks: TasksService
    ) {}
}

const Newsletters = {
    controller: NewslettersController,
    template: require('./newsletters.html')
};

export default angular.module('mpdx.home.care.newsletters', [
    tasks
]).component('newsletters', Newsletters).name;
