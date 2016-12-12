class CareController {
    tasksService;

    constructor(
        tasksService
    ) {
        this.tasksService = tasksService;

        this.newsletter = null;
    }
    $onInit() {
        console.error('home/care: analytics to first newsletter');
        // this.tasksService.getAnalytics().then((reponse) => {
        //     this.newsletter = reponse;
        // });
    }
    addNewsletter() {
        this.tasksService.openNewsletterModal({});
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

export default angular.module('mpdx.home.care.component', [])
    .component('homeCare', Care)
    .name;