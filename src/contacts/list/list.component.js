import ceil from 'lodash/fp/ceil';
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import includes from 'lodash/fp/includes';
import map from 'lodash/fp/map';
import pullAllBy from 'lodash/fp/pullAllBy';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';
import unionBy from 'lodash/fp/unionBy';

class ListController {
    accounts;
    alerts;
    contacts;
    contactsTags;
    modal;
    tasks;
    view;

    constructor(
        $log, $rootScope, $window, gettextCatalog,
        api, modal, contacts, contactFilter, contactsTags, alerts, tasks, accounts
    ) {
        this.$log = $log;
        this.$window = $window;
        this.accounts = accounts;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.contactFilter = contactFilter;
        this.contactsTags = contactsTags;
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

        $rootScope.$on('contactCreated', () => {
            this.load();
        });

        $rootScope.$on('accountListUpdated', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });

        $rootScope.$on('contactsFilterChange', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });

        $rootScope.$on('contactsTagsChange', () => {
            this.load();
            this.contacts.clearSelectedContacts();
        });
    }
    $onInit() {
        this.load();
    }
    loadMoreContacts() {
        if (this.loading || this.page >= this.meta.pagination.total_pages) {
            return;
        }
        this.page++;
        this.load(this.page);
    }
    toggleAllContacts() {
        if (this.contacts.selectedContacts.length < this.data.length) {
            this.selectAllContacts(false);
        } else {
            this.contacts.clearSelectedContacts();
        }
    }
    hideContact(contact) {
        return this.contacts.hideContact(contact).then(() => {
            this.data = reject({id: contact.id}, this.data);
        });
    }
    openAddTagModal() {
        this.modal.open({
            template: require('../sidebar/filter/tags/add/add.html'),
            controller: 'addTagController',
            locals: {
                selectedContacts: this.contacts.selectedContacts
            }
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
        this.tasks.addModal(this.contacts.selectedContacts);
    }
    openLogTaskModal() {
        this.tasks.logModal(this.contacts.selectedContacts);
    }
    openEditFieldsModal() {
        this.modal.open({
            template: require('./editFields/editFields.html'),
            controller: 'editFieldsController',
            locals: {
                selectedContacts: this.getSelectedContacts()
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
                template: require('./mergeContacts/mergeContacts.html'),
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
            template: require('./mapContacts/mapContacts.html'),
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
            this.page = 1;
            this.meta = {};
            this.data = null;
            this.listLoadCount++;
            currentCount = angular.copy(this.listLoadCount);
            const contactHeight = 70; //min pixel height of contact items
            this.pageSize = defaultTo(12, ceil(this.$window.innerHeight / contactHeight) - 2); //minimally adjust for menus (always pull at least a few extra)
        }

        return this.api.get({
            url: 'contacts',
            data: {
                filter: this.contacts.buildFilterParams(),
                page: page,
                per_page: this.pageSize,
                include: 'addresses,people,people.facebook_accounts,people.phone_numbers,people.email_addresses',
                fields: {
                    contact: 'addresses,name,status,square_avatar,send_newsletter,pledge_currency_symbol,pledge_frequency,pledge_received,uncompleted_tasks_count,tag_list,pledge_amount,people',
                    people: 'deceased,email_addresses,facebook_accounts,first_name,last_name,phone_numbers',
                    addresses: 'city,geo,historic,primary_mailing_address,postal_code,state,source,street',
                    email_addresses: 'email,historic,primary',
                    phone_numbers: 'historic,location,number,primary',
                    facebook_accounts: 'username'
                },
                sort: 'name'
            },
            overrideGetAsPost: true
        }).then(data => {
            this.$log.debug('contacts page ' + data.meta.pagination.page, data);
            if (reset && currentCount !== this.listLoadCount) {
                return;
            }
            let count = defaultTo(0, this.meta.to);
            this.meta = data.meta;
            if (reset) {
                count = 0;
            }
            if (data.length === 0) {
                this.getTotalCount();
                this.loading = false;
                return;
            }
            const newContacts = angular.copy(data);
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
            return map(id => {
                return {id: id};
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
            this.allSelected = true; //for reactive visuals
            return this.getCompleteFilteredList().then((data) => {
                this.contacts.selectedContacts = map('id', data);
            }).finally(() => {
                this.allSelected = false; //remove skeleton
            });
        } else {
            this.contacts.selectedContacts = map('id', this.data);
        }
    }
    bulkHideContacts() {
        const message = this.gettextCatalog.getString('Are you sure you wish to hide the selected contacts? Hiding a contact in MPDX actually sets the contact status to "Never Ask".');
        return this.modal.confirm(message).then(() => {
            const contacts = map(contact => {
                return {
                    id: contact,
                    status: 'Never Ask'
                };
            }, this.contacts.selectedContacts);
            return this.contacts.bulkSave(contacts).then(() => {
                this.data = pullAllBy('id', contacts, this.data);
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
    getTotalCount() { //only used when search is empty
        return this.api.get('contacts', {
            filter: {
                account_list_id: this.api.account_list_id
            },
            per_page: 0
        }).then((data) => {
            this.totalContactCount = data.meta.pagination.total_count;
        });
    }
}

const ContactList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        selected: '='
    }
};

import alerts from '../../common/alerts/alerts.service';
import contacts from '../contacts.service';
import tasks from '../../tasks/tasks.service';

export default angular.module('mpdx.contacts.list.component', [
    alerts, contacts, tasks
]).component('contactsList', ContactList).name;
