class ListController {
    accounts;
    alerts;
    contacts;
    contactsTags;
    modal;
    tasks;
    view;

    constructor(
        $rootScope,
        modal, contacts, contactsTags, alerts, tasks, accounts
    ) {
        this.accounts = accounts;
        this.alerts = alerts;
        this.contacts = contacts;
        this.modal = modal;
        this.contactsTags = contactsTags;
        this.tasks = tasks;
        this.contacts.reset();

        this.models = {
            addTags: {
                newTag: ''
            }
        };

        $rootScope.$on('contactCreated', () => {
            contacts.load(true);
        });

        $rootScope.$on('accountListUpdated', () => {
            contacts.load(true);
        });

        $rootScope.$on('contactsFilterChange', () => {
            contacts.load(true);
        });

        $rootScope.$on('contactsTagsChange', () => {
            contacts.load(true);
        });
    }
    $onInit() {
        this.contacts.load(true);
    }
    loadMoreContacts() {
        this.contacts.loadMoreContacts();
    }
    resetFilters() {
        this.contacts.resetFilters();
    }
    clearSelectedContacts() {
        this.contacts.clearSelectedContacts();
    }
    toggleAllContacts() {
        if (this.contacts.selectedContacts.length < this.contacts.data.length) {
            this.contacts.selectAllContacts(false);
        } else {
            this.contacts.clearSelectedContacts();
        }
    }
    hideContact(contact) {
        this.contacts.hideContact(contact);
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
                selectedContacts: this.contacts.selectedContacts
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
                selectedContacts: this.contacts.getSelectedContacts()
            }
        });
    }
    openMergeContactsModal() {
        const selectedLength = this.contacts.selectedContacts.length;
        if (selectedLength < 2) {
            this.alerts.addAlert('You must select at least 2 contacts to merge.', 'danger');
        } else if (selectedLength > 8) {
            this.alerts.addAlert('You can only merge up to 8 contacts at a time.', 'danger');
        } else {
            this.modal.open({
                template: require('./mergeContacts/mergeContacts.html'),
                controller: 'mergeContactsController',
                locals: {
                    selectedContacts: this.contacts.getSelectedContacts()
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
                selectedContacts: this.contacts.getSelectedContacts()
            }
        });
    }
}

const ContactList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        view: '@',
        selected: '='
    }
};

export default angular.module('mpdx.contacts.list.component', [])
    .component('contactsList', ContactList).name;
