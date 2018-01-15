import ceil from 'lodash/fp/ceil';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import find from 'lodash/fp/find';
import get from 'lodash/fp/get';
import includes from 'lodash/fp/includes';
import isArray from 'lodash/fp/isArray';
import map from 'lodash/fp/map';
import pullAllBy from 'lodash/fp/pullAllBy';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    constructor(
        $log, $rootScope, $window,
        gettextCatalog,
        accounts, alerts, api, contacts, contactFilter, contactsTags, modal, serverConstants, session, tasks
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.serverConstants = serverConstants;
        this.session = session;
        this.tasks = tasks;

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
        this.pageSize = 0;
        this.totalContactCount = 0;
    }
    $onInit() {
        this.load();

        this.watcher = this.$rootScope.$on('contactCreated', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });

        this.watcher2 = this.$rootScope.$on('accountListUpdated', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });

        this.watcher3 = this.$rootScope.$on('contactsFilterChange', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });

        this.watcher4 = this.$rootScope.$on('contactsTagsChange', () => {
            this.load();
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
    loadMoreContacts() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.load(this.page + 1);
    }
    toggleAllContacts() {
        if (this.data && this.contacts.selectedContacts && this.contacts.selectedContacts.length < this.data.length) {
            this.selectAllContacts(false);
        } else {
            this.contacts.clearSelectedContacts();
        }
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
                selectedContactIds: this.contacts.selectedContacts
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
        const reset = page === 1;

        let currentCount;
        if (reset) {
            this.meta = {};
            this.data = null;
            this.listLoadCount++;
            currentCount = angular.copy(this.listLoadCount);
            const contactHeight = 70; // min pixel height of contact items
            this.pageSize = defaultTo(12, ceil(this.$window.innerHeight / contactHeight) - 2); // minimally adjust for menus (always pull at least a few extra)
        }
        this.page = page;
        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                page: page,
                per_page: this.pageSize,
                include: 'addresses,people,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people,created_at,late_at',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street,updated_at',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            if (reset && currentCount !== this.listLoadCount) {
                return;
            }
            let count = reset ? 0 : defaultTo(0, this.meta.to);
            this.meta = data.meta;
            if (data.length === 0) {
                this.getTotalCount();
                this.loading = false;
                return;
            }
            const newContacts = this.contacts.fixPledgeAmountAndFrequencies(data);
            if (reset) {
                this.data = newContacts;
            } else {
                this.data = unionBy('id', this.data, newContacts);
            }
            count += data.length;
            this.meta.to = count;
            this.loading = false;
            return this.data;
        });
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
        }).then((data) => {
            this.totalContactCount = data.meta.pagination.total_count;
        });
    }
    getOption(filter, id) {
        return get('name', find({ id: id }, filter.options));
    }
    isArray(obj) {
        return isArray(obj);
    }
}

const ContactList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        selected: '='
    }
};

import gettextCatalog from 'angular-gettext';
import accounts from 'common/accounts/accounts.service';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import contacts from '../contacts.service';
import contactFilter from '../sidebar/filter/filter.service';
import contactsTags from '../sidebar/filter/tags/tags.service';
import modal from 'common/modal/modal.service';
import session from 'common/session/session.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.contacts.list.component', [
    gettextCatalog,
    accounts, alerts, api, contacts, contactFilter, contactsTags, modal, session, tasks
]).component('contactsList', ContactList).name;
