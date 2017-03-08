class NewslettersController {
    contacts;

    constructor(
        tasksService
    ) {
        this.tasksService = tasksService;
    }

}

const Newsletters = {
    controller: NewslettersController,
    template: require('./newsletters.html')
};


export default angular.module('mpdx.home.care.newsletters', [])
    .component('newsletters', Newsletters).name;
