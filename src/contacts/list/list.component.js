class ListController {
    alerts;
    contacts;
    contactsTags;
    currentAccountList;
    modal;
    tasksService;

    constructor(
        modal,
        contacts, contactsTags, alerts, tasksService, currentAccountList
    ) {
        this.alerts = alerts;
        this.contacts = contacts;
        this.modal = modal;
        this.contactsTags = contactsTags;
        this.currentAccountList = currentAccountList;
        this.tasksService = tasksService;

        this.models = {
            addTags: {
                newTag: ''
            }
        };
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
        if (this.contacts.getSelectedContacts().length < this.contacts.data.length) {
            this.contacts.selectAllContacts();
        } else {
            this.contacts.clearSelectedContacts();
        }
    }
    hideContact(contactId) {
        this.contacts.hideContact(contactId);
    }
    openAddTagModal() {
        this.modal.open({
            template: require('../../common/tags/add/add.html'),
            controller: 'addTagController',
            locals: {
                selectedContacts: this.contacts.getSelectedContactIds()
            }
        });
    }
    openRemoveTagModal() {
        this.modal.open({
            template: require('../../common/tags/remove/remove.html'),
            controller: 'removeTagController',
            locals: {
                selectedContacts: this.contacts.getSelectedContactIds()
            }
        });
    }
    openAddTaskModal() {
        this.tasksService.openModal({
            selectedContacts: this.contacts.getSelectedContactIds()
        });
    }
    openLogTaskModal() {
        this.modal.open({
            template: require('../logTask/logTask.html'),
            controller: 'logTaskController',
            locals: {
                selectedContacts: this.contacts.getSelectedContactIds(),
                toComplete: true,
                createNext: true,
                specifiedTask: null,
                ajaxAction: null
            }
        });
    }
    openEditFieldsModal() {
        this.modal.open({
            template: require('./editFields/editFields.html'),
            controller: 'editFieldsController',
            locals: {
                selectedContacts: this.contacts.getSelectedContactIds()
            }
        });
    }
    openMergeContactsModal() {
        const selectedLength = this.contacts.getSelectedContacts().length;
        if (selectedLength < 2) {
            this.alerts.addAlert('You must select at least 2 contacts to merge.', 'danger');
        } else if (selectedLength > 8) {
            this.alerts.addAlert('You can only merge up to 8 contacts at a time.', 'danger');
        } else {
            this.modal.open({
                template: require('./mergeContacts/mergeContacts.html'),
                controller: 'mergeContactsController',
                locals: {
                    contactIds: this.contacts.getSelectedContactIds(),
                    contactNames: this.contacts.getSelectedContactNames()
                }
            });
        }
    }
    openExportContactsModal() {
        this.modal.open({
            template: require('./exportContacts/exportContacts.html'),
            controller: 'exportContactsController'
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

