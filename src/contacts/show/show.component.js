class ContactController {
    contact;
    contacts;
    contactFilter;
    modal;
    contactReferrals;
    serverConstants;
    tasksService;

    constructor(
        $log, $state, $stateParams, $location, $anchorScroll, help,
        modal, contacts, tasksService, contactReferrals, contactFilter, serverConstants
    ) {
        this.$anchorScroll = $anchorScroll;
        this.$log = $log;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.modal = modal;
        this.contactReferrals = contactReferrals;
        this.serverConstants = serverConstants;
        this.tasksService = tasksService;

        this.selected = $stateParams.contactId;
        this.moveContact = { previous_contact: 0, following_contact: 0 };
        this.activeTab = '';
        this.contact = {};

        // serverConstants.fetchConstant('contacts', 'contacts/basic_list');
        // serverConstants.fetchConstants(['assignable_statuses' 'assignable_locations'']);

        this.tabsLabels = [
            { key: 'details', value: 'Details' },
            { key: 'donations', value: 'Donations' },
            { key: 'tasks', value: 'Tasks' },
            { key: 'history', value: 'History' },
            { key: 'referrals', value: 'Referrals' },
            { key: 'notes', value: 'Notes' }
        ];
        this.activeTab = this.tabsLabels[0]['key'];

        // $scope.$watch('$ctrl.preferencesContacts.data.contact_tabs_labels', () => {
        //     this.tabsLabels = this.preferencesContacts.data.contact_tabs_labels;
        //     if (angular.isDefined(this.tabsLabels)) {
        //         this.activeTab = this.tabsLabels[0]['key'];
        //     }
        // });

        // $scope.$watch('$ctrl.selected', this.selectContact.bind(this));

        this.sortableOptions = {
            containment: '#contact-tabs',
            //restrict move across columns. move only within column.
            accept: (sourceItemHandleScope, destSortableScope) => sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id,
            orderChanged: (event) => {
                var newIndex = event.dest.index;
                this.activeTab = this.tabsLabels[newIndex]['key'];

                if (newIndex >= this.tabsLabels.length) {
                    newIndex = this.tabsLabels.length - 1;
                }

                //this.preferencesContacts.data.contact_tabs_sort = this.tabsLabels.map(item => item['key']).join(); // TODO: Get tab sort data
                // this.preferencesContacts.save(); // TODO: save tab sort data
            },
            containerPositioning: 'relative'
        };

        help.suggest([
            '5845aab3c6979106d373a576',
            '5845995e90336006981769bb',
            '584ac7f39033602d65f6e131',
            '5845ac509033600698176a62',
            '58459880c6979106d373a4c2',
            '5845990290336006981769b1',
            '58459756903360069817698b',
            '584597e6903360069817699d',
            '584597a1c6979106d373a4b5',
            '58471fd6903360069817752e'
        ]);
    }
    $onChanges() {
        this.selectContact(this.$stateParams.contactId);
        this.contactPosition = this.getContactPosition();
    }
    selectContact(id) {
        this.$log.debug('select contact: ', id);
        if (!id) return;
        this.contacts.get(id).then((contact) => {
            this.$log.debug('selected contact: ', contact);
            this.contact = contact;
        });
    };
    save() {
        this.contacts.save(this.contact).then(() => {
            this.selectContact(this.$stateParams.contactId);
        });
    }
    getContactPosition() {
        return this.contacts.getContactPosition(this.$stateParams.contactId) + 1;
    }
    openAddReferralsModal() {
        this.modal.open({
            template: require('./referrals/add/add.html'),
            controller: 'addReferralsModalController',
            locals: {
                contactId: this.contact.id
            },
            onHide: () => {
                this.contactReferrals.fetchReferrals(this.contact.id);
            }
        });
    }
    openLogTaskModal() {
        this.modal.open({
            template: require('../logTask/logTask.html'),
            controller: 'logTaskController',
            locals: {
                selectedContacts: [this.contact.id],
                toComplete: true,
                createNext: true,
                specifiedTask: null,
                ajaxAction: null
            },
            onHide: () => {
                this.tasksService.fetchCompletedTasks(this.contact.id);
            }
        });
    }
    openAddTaskModal() {
        this.tasksService.openModal({
            selectedContacts: [this.contact.id],
            onHide: () => {
                this.tasksService.fetchUncompletedTasks(this.contact.id);
            }
        });
    }
    hideContact() {
        this.contacts.hideContact(this.contact).then(() => {
            if (this.contacts.canGoRight(this.contact.id)) {
                this.$state.go('contact', {contactId: this.contacts.getRightId(this.contact.id)});
            } else if (this.contacts.canGoLeft(this.contact.id)) {
                this.$state.go('contact', {contactId: this.contacts.getLeftId(this.contact.id)});
            }
        });
    }
    goLeft() {
        this.$state.go('contact', { contactId: this.contacts.getLeftId(this.contact.id) });
    }
    goRight() {
        this.$state.go('contact', { contactId: this.contacts.getRightId(this.contact.id) });
    }
    hidePreviousContact() {
        return this.moveContact.previous_contact === 0 || this.moveContact.previous_contact === '';
    }
    hideNextContact() {
        return this.moveContact.following_contact === 0 || this.moveContact.following_contact === '';
    }
    switchToPreviousContact() {
        //this.selected = this.contact.id;
        this.$state.go('contact', { contactId: this.moveContact.previous_contact });
    }
    switchToNextContact() {
        //this.selected = this.contact.id;
        this.$state.go('contact', { contactId: this.moveContact.following_contact });
    }
    callToSave() {
        this.save();
    }
    displayNotes() {
        this.activeTab = 'notes';
        this.$location.hash('contact-tabs');
        this.$anchorScroll();
    }
    filterCount() {
        return this.contactFilter.count();
    }
}

const Show = {
    controller: ContactController,
    template: require('./show.html')
};

export default angular.module('mpdx.contacts.show.component', [])
    .component('contact', Show).name;
