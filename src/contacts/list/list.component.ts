import 'angular-gettext';
import {
    assign,
    concat,
    defaultTo,
    includes,
    map,
    pullAllBy,
    reduce,
    reject,
    sortBy
} from 'lodash/fp';
import { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import { StateParams, StateService } from '@uirouter/core';
import accounts, { AccountsService } from '../../common/accounts/accounts.service';
import alerts, { AlertsService } from '../../common/alerts/alerts.service';
import api, { ApiService } from '../../common/api/api.service';
import contactFilter, { ContactFilterService } from '../sidebar/filter/filter.service';
import contacts, { ContactsService } from '../contacts.service';
import contactsTags, { ContactsTagsService } from '../sidebar/filter/tags/tags.service';
import modal, { ModalService } from '../../common/modal/modal.service';
import pagination from '../../common/pagination/pagination';
import session, { SessionService } from '../../common/session/session.service';
import tasks, { TasksService } from '../../tasks/tasks.service';
import users, { UsersService } from '../../common/users/users.service';

class ListController {
    allSelected: boolean;
    data: any;
    listLoadCount: number;
    loading: boolean;
    meta: any;
    models: any;
    page: number;
    pageSize: number;
    pagination: pagination;
    totalContactCount: number;
    watcher: any;
    watcher2: any;
    watcher3: any;
    watcher4: any;
    watcher5: any;
    watcher6: any;
    watcher7: any;
    watcher8: any;
    watcher9: any;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $scope: ng.IScope,
        private $state: StateService,
        private $stateParams: StateParams,
        private $window: ng.IWindowService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private accounts: AccountsService,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private contactFilter: ContactFilterService,
        private contactsTags: ContactsTagsService,
        private modal: ModalService,
        private serverConstants: ServerConstantsService,
        private session: SessionService,
        private tasks: TasksService,
        private users: UsersService
    ) {
        this.pagination = pagination;
        this.contacts.clearSelectedContacts();
        this.allSelected = false;
        this.data = [];
        this.listLoadCount = 0;
        this.loading = false;
        this.meta = {};
        this.models = {
            addTags: {
                newTag: ''
            }
        };
        this.page = 0;
        this.pageSize = defaultTo(25, users.getCurrentOptionValue('page_size_contacts'));
        this.totalContactCount = 0;
    }
    $onInit() {
        this.page = defaultTo(1, this.$stateParams.page);
        this.load(this.page);

        this.watcher = this.$rootScope.$on('contactCreated', () => {
            this.pageChange();
            this.contacts.clearSelectedContacts();
        });

        this.watcher2 = this.$rootScope.$on('accountListUpdated', () => {
            this.refreshFiltersAndTags().then(() => {
                this.pageChange();
            });
            this.contacts.clearSelectedContacts();
        });

        this.watcher3 = this.$rootScope.$on('contactsFilterChange', () => {
            this.pageChange();
            this.contacts.clearSelectedContacts();
        });

        this.watcher4 = this.$rootScope.$on('contactsTagsChange', () => {
            this.pageChange();
            this.contacts.clearSelectedContacts();
        });

        this.watcher5 = this.$rootScope.$on('contactTagsAdded', () => {
            this.contacts.clearSelectedContacts();
        });

        this.watcher9 = this.$rootScope.$on('contactHidden', (e, id) => {
            this.data = reject({ id: id }, this.data);
            // handle repagination here (like tasks does)
            this.contacts.clearSelectedContacts();
        });

        this.watcher6 = this.$rootScope.$on('contactTagDeleted', () => {
            this.contacts.clearSelectedContacts();
        });

        this.watcher7 = this.$rootScope.$on('taskAdded', () => {
            this.contacts.clearSelectedContacts();
        });

        this.watcher8 = this.$rootScope.$on('taskLogged', () => {
            this.contacts.clearSelectedContacts();
        });
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
        this.watcher3();
        this.watcher4();
        this.watcher5();
        this.watcher6();
        this.watcher7();
        this.watcher8();
        this.watcher9();
    }
    refreshFiltersAndTags() {
        return this.$q.all([
            this.contactFilter.load(),
            this.contactsTags.load()
        ]);
    }
    hideContact(contact) {
        return this.contacts.hideContact(contact).then(() => {
            this.data = reject({ id: contact.id }, this.data);
        });
    }
    openRemoveTagModal() {
        this.modal.open({
            template: require('../sidebar/filter/tags/remove/remove.html'),
            controller: 'removeTagController',
            locals: {
                selectedContacts: this.getSelectedContacts(),
                currentListSize: this.data.length
            }
        });
    }
    openAddTaskModal() {
        this.tasks.addModal({ contactsList: this.contacts.selectedContacts });
    }
    openEditFieldsModal() {
        this.modal.open({
            template: require('./editFields/editFields.html'),
            controller: 'editFieldsController',
            locals: {
                selectedContacts: this.getSelectedContacts()
            },
            resolve: {
                0: () => this.serverConstants.load(['bulk_update_options', 'locales'])
            }
        });
    }
    openMergeContactsModal() {
        const selectedLength = this.contacts.selectedContacts.length;
        if (selectedLength < 2) {
            this.alerts.addAlert(this.gettextCatalog.getPlural(2, 'You must select at least 1 contact to merge.', 'You must select at least {{$count}} contacts to merge.', {}), 'danger');
        } else if (selectedLength > 8) {
            this.alerts.addAlert(this.gettextCatalog.getPlural(8, 'You can only merge up to 1 contact at a time.', 'You can only merge up to {{$count}} contacts at a time.', {}), 'danger');
        } else {
            this.modal.open({
                template: require('./merge/merge.html'),
                controller: 'mergeContactsController',
                locals: {
                    selectedContacts: this.getSelectedContacts()
                }
            });
        }
    }
    openExportContactsModal() {
        this.modal.open({
            template: require('./exportContacts/exportContacts.html'),
            controller: 'exportContactsController',
            locals: {
                selectedContactIds: this.contacts.selectedContacts,
                filters: null
            }
        });
    }
    openMapContactsModal() {
        this.modal.open({
            template: require('./map/map.html'),
            controller: 'mapContactsController',
            locals: {
                selectedContacts: this.getSelectedContacts()
            }
        });
    }
    load(page = 1) {
        this.loading = true;

        let currentCount;
        this.meta = {};
        this.data = null;
        this.listLoadCount++;
        currentCount = angular.copy(this.listLoadCount);
        this.page = page;
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                page: page,
                per_page: this.pageSize,
                include: 'addresses,people,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,'
                        + 'pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,'
                        + 'people,created_at,late_at,primary_person',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street,updated_at',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            if (currentCount !== this.listLoadCount) {
                return;
            }
            this.meta = data.meta;
            if (data.length === 0) {
                this.getTotalCount();
                this.loading = false;
                return;
            }
            const fixedData = this.contacts.fixPledgeAmountAndFrequencies(data);
            this.data = this.sortPeoplePrimary(fixedData);
            this.loading = false;
            return this.data;
        });
    }
    private sortPeoplePrimary(data): any[] {
        // put primary on top
        const notPrimary = (contact, person) => contact.primary_person && person.id !== contact.primary_person.id;
        const sortNotPrimary = (contact) => sortBy((person) => notPrimary(contact, person), contact.people);
        return map((contact) => assign(contact, {
            people: sortNotPrimary(contact)
        }), data);
    }
    getSelectedContacts() {
        if (this.contacts.selectedContacts.length > this.data.length) {
            return map((id) => {
                return { id: id };
            }, this.contacts.selectedContacts);
        }
        return reduce((result, contact) => {
            if (includes(contact.id, this.contacts.selectedContacts)) {
                result = concat(result, contact);
            }
            return result;
        }, [], this.data);
    }
    selectAllContacts(all = true) {
        if (all) {
            this.allSelected = true; // for reactive visuals
            return this.getCompleteFilteredList().then((data) => {
                this.allSelected = false;
                this.contacts.selectedContacts = map('id', data);
            }).catch(() => {
                this.allSelected = false;
            });
        } else {
            this.contacts.selectedContacts = map('id', this.data);
        }
    }
    bulkHideContacts() {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contacts? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            const contacts = map((contact) => {
                return {
                    id: contact,
                    status: 'Never Ask'
                };
            }, this.contacts.selectedContacts);
            return this.contacts.bulkSave(contacts).then(() => {
                this.data = pullAllBy('id', contacts, this.data);
                this.contacts.clearSelectedContacts();
            });
        });
    }
    getCompleteFilteredList() {
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                fields: {
                    contacts: ''
                },
                per_page: 25000
            },
            overrideGetAsPost: true
        });
    }
    getTotalCount() { // only used when search is empty
        return this.api.get('contacts', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            per_page: 0
        }).then((data: any) => {
            this.totalContactCount = data.meta.pagination.total_count;
        });
    }
    pageSizeChange(size) {
        this.pageSize = size;
        this.load(1);
    }
    pageChange(page = 1) {
        if (this.$stateParams.page === 1 && page === 1) {
            this.load();
        }
        this.$state.go('contacts', { page: page }, { reload: false });
    }
}

const ContactList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        selected: '='
    }
};

export default angular.module('mpdx.contacts.list.component', [
    'gettext',
    accounts, alerts, api, contacts, contactFilter, contactsTags, modal, session, tasks, users
]).component('contactsList', ContactList).name;
