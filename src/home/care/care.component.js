class CareController {
    currentAccountListTasks;
    tasksService;

    constructor(currentAccountListTasks, tasksService) {
        this.currentAccountListTasks = currentAccountListTasks;
        this.tasksService = tasksService;

        this.newsletter = null;
    }
    $onInit() {
        this.currentAccountListTasks.getFirstCompleteNewsletter().then((reponse) => {
            this.newsletter = reponse;
        });
    }
    addNewsletter() {
        this.tasksService.openNewsletterModal({});
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

export default angular.module('mpdx.home.care', [])
    .component('homeCare', Care)
    .name;