class ListController {
    constructor(
        modal,
        contactsService, filterService, tagsService, alertsService, tasksService, currentAccountList
    ) {
        this.modal = modal;
        this.alertsService = alertsService;
        this.contactsService = contactsService;
        this.currentAccountList = currentAccountList;
        this.tagsService = tagsService;
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
            contentTemplate: '/common/bulk_remove_tag.html',
            controller: 'bulkRemoveTagController',
            controllerAs: 'vm',
            locals: {
                modalTitle: 'Remove Tags',
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
            contentTemplate: '/common/bulk_log_task.html',
            controller: 'bulkLogTaskController',
            controllerAs: 'vm',
            locals: {
                contacts: this.contactsService.getSelectedContactIds(),
                toComplete: true,
                createNext: true,
                specifiedTask: null,
                ajaxAction: null,
                modalTitle: 'Log Task'
            }
        });
    }
    openEditFieldsModal() {
        this.modal.open({
            contentTemplate: '/common/bulk_edit_fields.html',
            controller: 'bulkEditFieldsController',
            controllerAs: 'vm',
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
                contentTemplate: '/common/merge_contacts.html',
                controller: 'mergeContactsController',
                controllerAs: 'vm',
                locals: {
                    contactIds: this.contactsService.getSelectedContactIds(),
                    contactNames: this.contactsService.getSelectedContactNames()
                }
            });
        }
    }
    openExportContactsModal() {
        this.modal.open({
            contentTemplate: '/common/export_contacts.html',
            placement: 'center',
            controller: 'exportContactsController',
            controllerAs: 'vm'
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

