class CareController {
    constructor(
        $rootScope,
        modal
    ) {
        this.$rootScope = $rootScope;
        this.modal = modal;
    }
    addNewsletter() {
        return this.modal.open({
            template: require('../../tasks/modals/newsletter/newsletter.html'),
            controller: 'newsletterTaskController'
        }).then(() => {
            this.$rootScope.$emit('taskChange');
        });
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

import modal from 'common/modal/modal.service';

export default angular.module('mpdx.home.care.component', [
    modal
]).component('homeCare', Care).name;
