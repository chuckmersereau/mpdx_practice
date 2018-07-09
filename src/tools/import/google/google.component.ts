import 'angular-block-ui';
import 'angular-gettext';
import { each, map } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../../common/api/api.service';
import contactsTags, { ContactsTagsService } from '../../../contacts/sidebar/filter/tags/tags.service';
import google, { GoogleService } from '../../../preferences/integrations/google/google.service';
import joinComma from '../../../common/fp/joinComma';
import modal, { ModalService } from '../../../common/modal/modal.service';
import reduceObject from '../../../common/fp/reduceObject';
import uiRouter from '@uirouter/angularjs';

class ImportGoogleController {
    blockUI: IBlockUIService;
    import: any;
    selectedAccount: any;
    selected_account: any;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private contactsTags: ContactsTagsService,
        private google: GoogleService,
        private modal: ModalService
    ) {
        this.blockUI = blockUI.instances.get('tools-import-google');
        this.selected_account = null;
        this.import = {
            source: 'google',
            import_by_group: 'true',
            override: 'false',
            tag_list: [],
            in_preview: false
        };
    }
    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
            this.google.load(true);
        });

        if (this.google.data.length > 0) {
            this.selectedAccount = this.google.data[0];
            this.updateAccount();
        }
    }
    save() {
        return this.saveOrConfirm().then(() => {
            this.blockUI.reset();
            const message = this.gettextCatalog.getString('Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.');
            this.$state.go('tools');
            return this.modal.info(message);
        }).catch((err) => {
            this.blockUI.reset();
            throw err;
        });
    }
    private saveOrConfirm(): ng.IPromise<any> {
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        return this.import.import_by_group === 'true'
            ? this.apiSave(this.import, errorMessage)
            : this.confirmThenSave(errorMessage);
    }
    private confirmThenSave(errorMessage): ng.IPromise<any> {
        const importAllMessage = this.gettextCatalog.getString('Are you sure you want to import all contacts? This may import many contacts that you do not wish to have in MPDX. Many users find it more helpful to use the "Only import contacts from certain groups" option.');
        return this.modal.confirm(importAllMessage).then(() => this.apiSave(this.import, errorMessage));
    }
    apiSave(data, errorMessage) {
        this.blockUI.start();
        let transformedData = angular.copy(data);

        transformedData.tag_list = joinComma(transformedData.tag_list);
        transformedData.group_tags = reduceObject((result, tags, key) => {
            result[key] = joinComma(tags);
            return result;
        }, {}, transformedData.group_tags);

        return this.api.post({
            url: `account_lists/${this.api.account_list_id}/imports/google`,
            data: transformedData,
            type: 'imports',
            errorMessage: errorMessage
        });
    }
    updateAccount() {
        this.import.source_account = { id: this.selectedAccount.id };
        this.import.groups = [];
        this.import.group_tags = {};
        each((group) => {
            this.import.group_tags[group.id] = [group.tag];
        }, this.selectedAccount.contact_groups);
    }
    checkAllGoogleContactGroups() {
        this.import.groups = map((group) => group.id, this.selectedAccount.contact_groups);
    }
    uncheckAllGoogleContactGroups() {
        this.import.groups = [];
    }
}

const ImportGoogle = {
    controller: ImportGoogleController,
    template: require('./google.html')
};

export default angular.module('mpdx.tools.import.google.component', [
    uiRouter, 'blockUI', 'gettext',
    api, contactsTags, google, modal
]).component('importGoogle', ImportGoogle).name;