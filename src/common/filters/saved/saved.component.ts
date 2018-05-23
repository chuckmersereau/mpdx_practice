import 'angular-gettext';
import { defaultTo, filter, get, map, pull, replace, startsWith, union } from 'lodash/fp';
import api, { ApiService } from '../../api/api.service';
import modal, { ModalService } from '../../modal/modal.service';
import replaceAll from '../../fp/replaceAll';
import users, { UsersService } from '../../users/users.service';

class SavedController {
    protected savedFilterNames: string[];
    private start: string;
    private type: string;
    private watcher: () => void;
    private watcher2: () => void;
    constructor(
        private $rootScope: ng.IRootScopeService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private api: ApiService,
        private modal: ModalService,
        private users: UsersService
    ) {}
    $onInit() {
        this.start = `saved_${this.type}_filter_`;
        this.getSavedFilters();

        this.watcher = this.$rootScope.$on('savedFilterAdded', (e, key) => {
            if (startsWith(this.start, key)) {
                this.savedFilterNames = union([replace(this.start, '', key)], this.savedFilterNames);
            }
        });
        this.watcher2 = this.$rootScope.$on('accountListUpdated', () => {
            this.getSavedFilters();
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    getSavedFilters() {
        const optionsForAccountList = filter((option) => {
            const value = defaultTo('', get('value', option));
            return value.indexOf(`"account_list_id":"${this.api.account_list_id}"`) > -1;
        }, this.users.currentOptions);
        const savedFilterKeys = map('key', filter((option) => startsWith(this.start, option.key), optionsForAccountList));
        this.savedFilterNames = map(replace(this.start, ''), savedFilterKeys);
    }
    remove(key) {
        const name = replaceAll('_', ' ', key);
        const msg = this.gettextCatalog.getString(
            'Are you sure you wish to delete the saved filter "{{ name }}"?',
            { name: name }
        );
        return this.modal.confirm(msg).then(() => {
            return this.users.deleteOption(this.start + key).then(() => {
                this.savedFilterNames = pull(key, this.savedFilterNames);
            });
        });
    }
}

const saved: ng.IComponentOptions = {
    template: require('./saved.html'),
    controller: SavedController,
    bindings: {
        type: '@',
        selected: '<',
        onSelect: '&'
    }
};

export function strReplace() {
    return function(input = '', from = '', to = '') {
        return input.replace(new RegExp(from, 'g'), to);
    };
}

export default angular.module('mpdx.common.filter.saved.component', [
    'gettext',
    api, modal, users
]).component('savedFilters', saved)
    .filter('strReplace', strReplace).name;