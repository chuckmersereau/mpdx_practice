class CareController {
    tasksService;

    constructor(
        tasksService
    ) {
        this.tasksService = tasksService;
    }
    addNewsletter() {
        this.tasksService.openNewsletterModal();
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

export default angular.module('mpdx.home.care.component', [])
    .component('homeCare', Care)
    .name;
