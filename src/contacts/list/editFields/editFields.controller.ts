import contacts, { ContactsService } from '../../contacts.service';
import contactsTags, { ContactsTagsService } from '../../sidebar/filter/tags/tags.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';

class EditFieldsController {
    languages: any[];
    models: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private contactsTags: ContactsTagsService,
        private locale: LocaleService,
        private serverConstants: ServerConstantsService,
        private contacts: ContactsService,
        private selectedContacts: any[]
    ) {
        this.models = {};
        this.languages = locale.getLocalesMap();
    }
    save() {
        return this.contacts.bulkEditFields(
            this.models,
            this.selectedContacts
        ).then(() => {
            this.$scope.$hide();
            this.$rootScope.$emit('contactCreated');
        });
    }
}

export default angular.module('mpdx.contacts.list.editFields.controller', [
    contacts, contactsTags, locale, serverConstants
])
    .controller('editFieldsController', EditFieldsController).name;
