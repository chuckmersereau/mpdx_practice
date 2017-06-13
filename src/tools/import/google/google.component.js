import each from 'lodash/fp/each';
import map from 'lodash/fp/map';

class ImportGoogleController {
    constructor(
        $rootScope,
        $state, blockUI, gettextCatalog,
        alerts, contactsTags, google, importGoogle, modal
    ) {
        this.$rootScope = $rootScope;

        this.$state = $state;
        this.blockUI = blockUI.instances.get('tools-import-google');
        this.gettextCatalog = gettextCatalog;

        this.alerts = alerts;
        this.contactsTags = contactsTags;
        this.google = google;
        this.importGoogle = importGoogle;
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
            this.contactsTags.load(true);
            this.google.load(true);
        });


        if (this.google.data.length > 0) {
            this.selectedAccount = this.google.data[0];
            this.updateAccount();
        }
    }

    save() {
        this.blockUI.start();
        return this.importGoogle.save(this.import).then(() => {
            this.blockUI.reset();
            const message = this.gettextCatalog.getString(
                'Your Google import has started and your contacts will be in MPDX shortly. We will email you when your import is complete.'
            );
            this.$state.go('tools');
            return this.modal.info(message);
        }).catch((err) => {
            this.blockUI.reset();
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger');
            throw err;
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
        this.import.groups = map(group => group.id, this.selectedAccount.contact_groups);
    }

    uncheckAllGoogleContactGroups() {
        this.import.groups = [];
    }
}

const ImportGoogle = {
    controller: ImportGoogleController,
    template: require('./google.html')
};

import uiRouter from 'angular-ui-router';
import blockUI from 'angular-block-ui';
import gettextCatalog from 'angular-gettext';
import alerts from 'common/alerts/alerts.service';
import contactsTags from 'contacts/sidebar/filter/tags/tags.service';
import google from 'preferences/integrations/google/google.service';
import importGoogle from './google.service';
import modal from 'common/modal/modal.service';

export default angular.module('mpdx.tools.import.google.component', [
    uiRouter, blockUI, gettextCatalog,
    alerts, contactsTags, google, importGoogle, modal
]).component('importGoogle', ImportGoogle).name;