class ContactController {
    contact;
    contactsService;
    modal;
    tasksService;

    constructor(
        $scope, $state, $stateParams, $location,
        modal, cache, contactsService, tasksService, referralsService, preferencesContactsService, serverConstants
    ) {
        this.$location = $location;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.cache = cache;
        this.contactsService = contactsService;
        this.modal = modal;
        this.referralsService = referralsService;
        this.tasksService = tasksService;

        this.selected = $stateParams.contactId;
        this.preferences = preferencesContactsService;
        this.moveContact = {previous_contact: 0, following_contact: 0};
        this.activeTab = '';
        this.contact = {};
        this.primaryAddress = {};
        this.primaryAddressIndex = '';
        serverConstants.fetchConstant('contacts', 'contacts/basic_list');
        serverConstants.fetchConstants(['assignable_send_newsletters', 'assignable_statuses', 'pledge_frequencies', 'pledge_currencies', 'assignable_locations']);
        this.constants = serverConstants.data;

        this.tabsLabels = [];
        $scope.$watch('vm.preferences.data.contact_tabs_labels', () => {
            this.tabsLabels = this.preferences.data.contact_tabs_labels;
            if (angular.isDefined(this.tabsLabels)) {
                this.activeTab = this.tabsLabels[0]['key'];
            }
        });

        $scope.$watch('vm.selected', this.selectContact.bind(this));
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

                this.preferences.data.contact_tabs_sort = this.tabsLabels.map(item => item['key']).join();
                this.preferences.save(() => {
                }, () => {
                });
            },
            containerPositioning: 'relative'
        };
    }
    selectContact(id) {
        this.cache.get(id).then((contact) => {
            if (!contact) return;
            this.contact = contact;
            for (var i = 0; i < this.contact.addresses.length; i++) {
                var address = this.contact.addresses[i];
                if (address.primary_mailing_address === true) {
                    this.primaryAddress = address;
                    this.primaryAddressIndex = i;
                    break;
                }
            }
        });
    };
    save() {
        this.contactsService.save(this.contact).then(() => {
            this.selectContact(this.$stateParams.contactId);
        });
    }
    getContactPosition() {
        return this.contactsService.getContactPosition(this.$stateParams.contactId) + 1;
    }
    openAddReferralsModal() {
        this.modal.open({
            big: true,
            contentTemplate: '/contacts/show/add_referrals_modal.html',
            controller: 'addReferralsModalController',
            controllerAs: 'vm',
            locals: {
                contactId: this.contact.id
            },
            onHide: this.referralsService.fetchReferrals.bind(this, this.contact.id)
        });
    }
    openLogTaskModal() {
        this.modal.open({
            template: require('../logTask/logTask.html'),
            controller: 'logTaskController',
            locals: {
                contacts: [this.contact.id],
                toComplete: true,
                createNext: true,
                specifiedTask: null,
                ajaxAction: null
            },
            onHide: this.tasksService.fetchCompletedTasks.bind(this, this.contact.id)
        });
    }
    openAddTaskModal() {
        this.tasksService.openModal({
            contacts: [this.contact.id],
            onHide: this.tasksService.fetchUncompletedTasks.bind(this, this.contact.id)
        });
    }
    hideContact() {
        if (this.contactsService.canGoRight(this.contact.id)) {
            this.$location.url('/contacts/' + this.contactsService.getRightId(this.contact.id));
        } else if (this.contactsService.canGoLeft(this.contact.id)) {
            this.$location.url('/contacts/' + this.contactsService.getLeftId(this.contact.id));
        }
        this.contactsService.hideContact(this.contact.id);
    }
    goLeft() {
        if (this.contactsService.canGoLeft(this.contact.id)) {
            this.$location.url('/contacts/' + this.contactsService.getLeftId(this.contact.id));
        } else {
            this.$location.url('/contacts/' + this.contactsService.data[this.contactsService.data.length - 1].contact.id);
        }
    }
    goRight() {
        if (this.contactsService.canGoRight(this.contact.id)) {
            this.$location.url('/contacts/' + this.contactsService.getRightId(this.contact.id));
        } else {
            this.$location.url('/contacts/' + this.contactsService.data[0].contact.id);
        }
    }
    hidePreviousContact() {
        return this.moveContact.previous_contact === 0 || this.moveContact.previous_contact === '';
    }
    hideNextContact() {
        return this.moveContact.following_contact === 0 || this.moveContact.following_contact === '';
    }
    switchToPreviousContact() {
        //this.selected = this.contact.id;
        this.$state.transitionTo('contact', {id: this.moveContact.previous_contact});
    }
    switchToNextContact() {
        //this.selected = this.contact.id;
        this.$state.transitionTo('contact', {id: this.moveContact.following_contact});
    }
    callToSave() {
        this.save();
    }
}

const Show = {
    controller: ContactController,
    controllerAs: 'vm',
    template: require('./show.html')
};

export default angular.module('mpdx.contacts.show.component', [])
    .component('contact', Show).name;
