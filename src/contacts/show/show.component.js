import createPatch from "../../common/fp/createPatch";
import joinComma from "../../common/fp/joinComma";
import concat from 'lodash/fp/concat';
import find from 'lodash/fp/find';
import forEachRight from 'lodash/fp/forEachRight';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

class ContactController {
    alerts;
    contact;
    contacts;
    contactFilter;
    modal;
    tasks;
    users;

    constructor(
        $log, $state, $stateParams, $location, $anchorScroll, blockUI, gettextCatalog, help,
        alerts, modal, contacts, tasks, contactFilter, users
    ) {
        this.$anchorScroll = $anchorScroll;
        this.$log = $log;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.alerts = alerts;
        this.blockUI = blockUI.instances.get('contactShow');
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.tasks = tasks;
        this.users = users;

        this.moveContact = { previous_contact: 0, following_contact: 0 };
        this.activeTab = '';
        this.contact = {};

        let tabsLabels = [
            { key: 'details', value: gettextCatalog.getString('Details') },
            { key: 'donations', value: gettextCatalog.getString('Donations') },
            { key: 'tasks', value: gettextCatalog.getString('Tasks') },
            { key: 'history', value: gettextCatalog.getString('History') },
            { key: 'referrals', value: gettextCatalog.getString('Referrals') },
            { key: 'notes', value: gettextCatalog.getString('Notes') }
        ];
        if (users.current.options.contact_tabs_sort) {
            forEachRight(tab => {
                const label = find({key: tab}, tabsLabels);
                if (label) {
                    tabsLabels = reject({key: tab}, tabsLabels);
                    tabsLabels = concat(label, tabsLabels);
                }
            }, users.current.options.contact_tabs_sort.value.split(','));
        }

        this.tabsLabels = tabsLabels;
        this.activeTab = this.tabsLabels[0]['key'];

        this.sortableOptions = {
            containment: '#contact-tabs',
            //restrict move across columns. move only within column.
            accept: (sourceItemHandleScope, destSortableScope) => sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id,
            orderChanged: (event) => {
                let newIndex = event.dest.index;
                this.activeTab = this.tabsLabels[newIndex]['key'];

                if (newIndex >= this.tabsLabels.length) {
                    newIndex = this.tabsLabels.length - 1;
                }

                const contactTabsSort = {
                    key: 'contact_tabs_sort',
                    value: joinComma(map('key', this.tabsLabels))
                };
                if (users.current.options.contact_tabs_sort) {
                    contactTabsSort.updated_in_db_at = users.current.options.contact_tabs_sort.updated_in_db_at;
                    users.setOption(contactTabsSort);
                } else {
                    users.createOption(contactTabsSort.key, contactTabsSort.value);
                }
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
        this.$log.debug('selected contact: ', this.contact);
        this.contactInitialState = angular.copy(this.contact);
    }
    save() {
        const source = angular.copy(this.contact); //to avoid onChanges changes
        const target = angular.copy(this.contactInitialState); //to avoid onChanges changes
        const patch = createPatch(target, source);
        this.$log.debug('contact patch', patch);

        return this.contacts.save(patch).then((data) => {
            this.contact.updated_in_db_at = data.updated_in_db_at;
            this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'));
        });
    }
    onPrimary(personId) {
        this.$log.debug('change primary: ', personId);
        this.contact.primary_person.id = personId;
        this.save();
    }
    openAddReferralsModal() {
        this.modal.open({
            template: require('./referrals/add/add.html'),
            controller: 'addReferralsModalController',
            locals: {
                contact: this.contact
            }
        });
    }
    openLogTaskModal() {
        this.modal.open({
            template: require('../../tasks/log/log.html'),
            controller: 'logTaskController',
            locals: {
                selectedContacts: [this.contact.id],
                toComplete: true,
                createNext: true,
                specifiedTask: null,
                ajaxAction: null
            },
            onHide: () => {
                this.tasks.fetchCompletedTasks(this.contact.id);
            }
        });
    }
    openAddTaskModal() {
        this.tasks.openModal({
            selectedContacts: [this.contact.id],
            onHide: () => {
                this.tasks.fetchUncompletedTasks(this.contact.id);
            }
        });
    }
    hideContact() {
        this.contacts.hideContact(this.contact).then(() => {
            this.$state.go('contacts');
        });
    }
    goLeft() {
        this.$state.go('contacts.show', { contactId: this.contacts.getLeftId(this.contact.id) });
    }
    goRight() {
        this.$state.go('contacts.show', { contactId: this.contacts.getRightId(this.contact.id) });
    }
    displayNotes() {
        this.activeTab = 'notes';
        this.$location.hash('contact-tabs');
        this.$anchorScroll();
    }
}

const Show = {
    controller: ContactController,
    template: require('./show.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.component', [])
    .component('contact', Show).name;
