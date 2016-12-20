class ContactController {
    cache;
    contacts;
    contactFilter;
    contactReferrals;
    modal;
    preferencesContacts;
    tasksService;
    contact;

    constructor(
        $scope, $state, $stateParams, $location, $anchorScroll, help,
        modal, cache, contacts, tasksService, contactReferrals, preferencesContacts, contactFilter, serverConstants
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.cache = cache;
        this.contactFilter = contactFilter;
        this.contactReferrals = contactReferrals;
        this.contacts = contacts;
        this.modal = modal;
        this.preferencesContacts = preferencesContacts;
        this.tasksService = tasksService;

        this.selected = $stateParams.contactId;
        this.moveContact = { previous_contact: 0, following_contact: 0 };
        this.activeTab = '';
        this.contact = {};
        serverConstants.fetchConstant('contacts', 'contacts/basic_list');
        serverConstants.fetchConstants(['assignable_send_newsletters', 'assignable_statuses', 'pledge_frequencies', 'pledge_currencies', 'assignable_locations', 'assignable_likely_to_gives']);
        this.constants = serverConstants.data;

        this.tabsLabels = [];
        $scope.$watch('$ctrl.preferencesContacts.data.contact_tabs_labels', () => {
            this.tabsLabels = this.preferencesContacts.data.contact_tabs_labels;
            if (angular.isDefined(this.tabsLabels)) {
                this.activeTab = this.tabsLabels[0]['key'];
            }
        });

        $scope.$watch('$ctrl.selected', this.selectContact.bind(this));
        this.selectContact($stateParams.id);
        this.contactPosition = this.getContactPosition();

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

                this.preferencesContacts.data.contact_tabs_sort = this.tabsLabels.map(item => item['key']).join();
                this.preferencesContacts.save();
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
    selectContact(id) {
        this.cache.get(id).then((contact) => {
            if (!contact) return;
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
        this.contacts.hideContact(this.contact.id).then(() => {
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
