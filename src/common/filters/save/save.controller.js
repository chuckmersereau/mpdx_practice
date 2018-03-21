import { defaultTo, find } from 'lodash/fp';
import { convertTags } from 'common/fp/tags';
import replaceAll from 'common/fp/replaceAll';

class Save {
    constructor(
        $rootScope, $scope, gettextCatalog,
        api, modal, users,
        anyTags, filterType, params, rejectedTags, selectedTags, wildcardSearch
    ) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.anyTags = anyTags;
        this.api = api;
        this.filterType = filterType;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.params = params;
        this.selectedTags = selectedTags;
        this.users = users;
        this.wildcardSearch = wildcardSearch;
    }
    save() {
        const value = {
            any_tags: this.anyTags,
            account_list_id: this.api.account_list_id,
            params: this.api.cleanFilters(this.params),
            tags: convertTags(this.selectedTags),
            exclude_tags: convertTags(this.rejectedTags),
            wildcard_search: this.wildcardSearch
        };
        const jsonFilters = JSON.stringify(value);
        const name = replaceAll(' ', '_', this.name);
        const key = `saved_${this.filterType}_filter_${name}`;
        let option = find({ key: key }, this.users.currentOptions);
        const promise = option ? this.checkUpdateOption(option, jsonFilters) : this.createOption(key, jsonFilters);
        promise.then(() => {
            this.$rootScope.$emit('savedFilterAdded', key);
            this.$scope.$hide();
        });
        return promise;
    }
    createOption(key, data) {
        return this.api.post({
            url: 'user/options',
            data: {
                data: {
                    attributes: {
                        key: key,
                        value: data
                    },
                    type: 'user_options'
                }
            },
            doSerialization: false,
            autoParams: false
        }).then(() => this.afterSave(key, data));
    }
    checkUpdateOption(option, data) {
        const msg = this.gettextCatalog.getString('A filter with that name already exists. Do you wish to replace it.');
        return this.modal.confirm(msg).then(() => this.updateOption(option, data));
    }
    updateOption(option, data) {
        return this.api.put({
            url: `user/options/${option.key}`,
            data: {
                data: {
                    attributes: {
                        title: option.title,
                        value: data,
                        overwrite: true
                    },
                    type: 'user_options'
                }
            },
            doSerialization: false,
            autoParams: false
        }).then(() => this.afterSave(option.key, data));
    }
    afterSave(key, data) {
        let option = defaultTo({}, find({ key: key }, this.users.currentOptions));
        option.value = data;
        this.users.currentOptions[key] = option;
    }
}

import api from 'common/api/api.service';
import modal from 'common/modal/modal.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.common.filter.save.controller', [
    api, modal, users
]).controller('saveFilterModal', Save).name;