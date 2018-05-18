import 'angular-gettext';
import { convertTags } from '../../fp/tags';
import { defaultTo, find } from 'lodash/fp';
import api, { ApiService } from '../../api/api.service';
import modal, { ModalService } from '../../modal/modal.service';
import replaceAll from '../../fp/replaceAll';
import users, { UsersService } from '../../users/users.service';

class Save {
    protected name: string;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private users: UsersService,
        private anyTags: boolean,
        private filterType: string,
        private params: any,
        private rejectedTags: any,
        private selectedTags: any,
        private wildcardSearch: string
    ) {}
    save(): ng.IPromise<void> {
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
        const option = find({ key: key }, this.users.currentOptions);
        const promise = option ? this.checkUpdateOption(option, jsonFilters) : this.createOption(key, jsonFilters);
        promise.then(() => {
            this.$rootScope.$emit('savedFilterAdded', key);
            this.$scope.$hide();
        });
        return promise;
    }
    private createOption(key: string, data: any): ng.IPromise<void> {
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
    private checkUpdateOption(option: any, data: any): ng.IPromise<void> {
        const msg = this.gettextCatalog.getString('A filter with that name already exists. Do you wish to replace it.');
        return this.modal.confirm(msg).then(() => this.updateOption(option, data));
    }
    private updateOption(option: any, data: any): ng.IPromise<void> {
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
    private afterSave(key: string, data: any): void {
        let option: any = defaultTo({}, find({ key: key }, this.users.currentOptions));
        option.value = data;
        this.users.currentOptions[key] = option;
    }
}

export default angular.module('mpdx.common.filter.save.controller', [
    'gettext',
    api, modal, users
]).controller('saveFilterModal', Save).name;