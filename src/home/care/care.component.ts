import api, { ApiService } from '../../common/api/api.service';
import contactFilter from '../../contacts/sidebar/filter/filter.service';
import modal, { ModalService } from '../../common/modal/modal.service';

class CareController {
    constructor(
        private $rootScope: ng.IRootScopeService,
        private api: ApiService,
        private contactFilter: any,
        private modal: ModalService
    ) {
        this.$rootScope = $rootScope;
        this.api = api;
        this.contactFilter = contactFilter;
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
    exportPhysical() {
        this.modal.open({
            template: require('../../contacts/list/exportContacts/exportContacts.html'),
            controller: 'exportContactsController',
            locals: {
                selectedContactIds: [],
                filters: {
                    account_list_id: this.api.account_list_id,
                    newsletter: 'address',
                    status: 'active'
                }
            }
        });
    }
    exportEmail() {
        this.modal.open({
            template: require('./newsletters/export/export.html'),
            controller: 'exportContactEmailsController'
        });
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

export default angular.module('mpdx.home.care.component', [
    api, contactFilter, modal
]).component('homeCare', Care).name;
