import { each, map } from 'lodash/fp';
import joinComma from 'common/fp/joinComma';
import reduceObject from 'common/fp/reduceObject';

class ImportGoogleController {
    constructor(
        $rootScope,
        $state, blockUI, gettextCatalog,
        api, contactsTags, google, modal
    ) {
        this.$rootScope = $rootScope;

        this.$state = $state;
        this.blockUI = blockUI.instances.get('tools-import-google');
        this.gettextCatalog = gettextCatalog;

        this.api = api;
        this.contactsTags = contactsTags;
        this.google = google;
        this.modal = modal;

        this.selected_account = null;
        this.import = {
            source: 'google',
            import_by_group: 'false',
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
        this.blockUI.start();
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        return this.apiSave(this.import, errorMessage).then(() => {
            this.blockUI.reset();
            const message = this.gettextCatalog.getString('Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.');
            this.$state.go('tools');
            return this.modal.info(message);
        }).catch((err) => {
            this.blockUI.reset();
            throw err;
        });
    }
    apiSave(data, errorMessage) {
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

import api from 'common/api/api.service';
import uiRouter from '@uirouter/angularjs';
import blockUI from 'angular-block-ui';
import gettextCatalog from 'angular-gettext';
import contactsTags from 'contacts/sidebar/filter/tags/tags.service';
import google from 'preferences/integrations/google/google.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.tools.import.google.component', [
    uiRouter, blockUI, gettextCatalog,
    api, contactsTags, google, modal
]).component('importGoogle', ImportGoogle).name;