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

export default angular.module('mpdx.home.care.component', [])
    .component('homeCare', Care)
    .name;
