class CareController {
    constructor(currentAccountList, tasksService) {
        this.currentAccountList = currentAccountList;
        this.tasksService = tasksService;

        this.newsletter = null;
    }
    $onInit() {
        this.currentAccountList.tasks.getFirstCompleteNewsletter().then((reponse) => {
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