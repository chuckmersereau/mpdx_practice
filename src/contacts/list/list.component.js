class ListController {
    constructor(
        modal,
        contactsService, filterService, contactsTagsService, alertsService, tasksService, currentAccountList
    ) {
        this.modal = modal;
        this.alertsService = alertsService;
        this.contactsService = contactsService;
        this.currentAccountList = currentAccountList;
        this.tagsService = contactsTagsService;
        this.tasksService = tasksService;

        this.models = {
            addTags: {
                newTag: ''
            }
        };
    }
    loadMoreContacts() {
        this.contactsService.loadMoreContacts();
    }
    resetFilters() {
        this.contactsService.resetFilters();
    }
    clearSelectedContacts() {
        this.contactsService.clearSelectedContacts();
    }
    toggleAllContacts() {
        if (this.contactsService.getSelectedContacts().length < this.contactsService.data.length) {
            this.contactsService.selectAllContacts();
        } else {
            this.contactsService.clearSelectedContacts();
        }
    }
    hideContact(contactId) {
        this.contactsService.hideContact(contactId);
    }
    openAddTagModal() {
        this.modal.open({
            template: require('../../common/tags/add/add.html'),
            controller: 'addTagController',
            locals: {
                contacts: this.contactsService.getSelectedContactIds()
            }
        });
    }
    openRemoveTagModal() {
        this.modal.open({
            template: require('../../common/tags/remove/remove.html'),
            controller: 'removeTagController',
            locals: {
                contacts: this.contactsService.getSelectedContactIds()
            }
        });
    }
    openAddTaskModal() {
        this.tasksService.openModal({
            contacts: this.contactsService.getSelectedContactIds()
        });
    }
    openLogTaskModal() {
        this.modal.open({
            template: require('../logTask/logTask.html'),
            controller: 'logTaskController',
            locals: {
                contacts: this.contactsService.getSelectedContactIds(),
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
                contacts: this.contactsService.getSelectedContactIds()
            }
        });
    }
    openMergeContactsModal() {
        var selectedLength = this.contactsService.getSelectedContacts().length;
        if (selectedLength < 2) {
            this.alertsService.addAlert('You must select at least 2 contacts to merge.', 'danger');
        } else if (selectedLength > 8) {
            this.alertsService.addAlert('You can only merge up to 8 contacts at a time.', 'danger');
        } else {
            this.modal.open({
                template: require('./mergeContacts/mergeContacts.html'),
                controller: 'mergeContactsController',
                locals: {
                    contactIds: this.contactsService.getSelectedContactIds(),
                    contactNames: this.contactsService.getSelectedContactNames()
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
    controllerAs: 'vm',
    template: require('./list.html'),
    bindings: {
        view: '@',
        selected: '='
    }
};

export default angular.module('mpdx.contacts.list.component', [])
    .component('contactsList', ContactList).name;
