import createPatch from "../../common/fp/createPatch";
import joinComma from "../../common/fp/joinComma";
import concat from 'lodash/fp/concat';
import defaultTo from 'lodash/fp/defaultTo';
import eq from 'lodash/fp/eq';
import find from 'lodash/fp/find';
import forEachRight from 'lodash/fp/forEachRight';
import get from 'lodash/fp/get';
import has from 'lodash/fp/has';
import isNil from 'lodash/fp/isNil';
import map from 'lodash/fp/map';
import reject from 'lodash/fp/reject';

class ContactController {
    alerts;
    contacts;
    contactFilter;
    modal;
    tasks;
    users;

    constructor(
        $log, $rootScope, $state, $stateParams, $location, $anchorScroll, blockUI, gettextCatalog, help,
        alerts, modal, contacts, tasks, contactFilter, people, users
    ) {
        this.$anchorScroll = $anchorScroll;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.alerts = alerts;
        this.blockUI = blockUI.instances.get('contactShow');
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.people = people;
        this.tasks = tasks;
        this.users = users;

        if ($stateParams['personId']) {
            this.people.openPeopleModal(this.contacts.current, $stateParams['personId']);
        }

        this.moveContact = { previous_contact: 0, following_contact: 0 };
        this.activeTab = '';

        let tabsLabels = [
            { key: 'details', value: gettextCatalog.getString('Details') },
            { key: 'donations', value: gettextCatalog.getString('Donations') },
            { key: 'tasks', value: gettextCatalog.getString('Tasks') },
            { key: 'referrals', value: gettextCatalog.getString('Referrals') },
            { key: 'notes', value: gettextCatalog.getString('Notes') }
        ];
        if (has('currentOptions.contact_tabs_sort', users)) {
            forEachRight(tab => {
                const label = find({key: tab}, tabsLabels);
                if (label) {
                    tabsLabels = reject({key: tab}, tabsLabels);
                    tabsLabels = concat(label, tabsLabels);
                }
            }, users.currentOptions.contact_tabs_sort.value.split(','));
        }

        this.tabsLabels = tabsLabels;
        this.activeTab = defaultTo(this.tabsLabels[0]['key'], this.$state.$current.name.split('.')[2]);

        if (this.activeTab !== 'details') {
            this.$state.go(`contacts.show.${this.activeTab}`);
        }

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
                if (users.currentOptions.contact_tabs_sort) {
                    users.setOption(contactTabsSort);
                } else {
                    users.createOption(contactTabsSort.key, contactTabsSort.value);
                }
            },
            containerPositioning: 'relative'
        };

        help.suggest([
            this.gettextCatalog.getString('58d3d70ddd8c8e7f5974d3ca'),
            this.gettextCatalog.getString('5845aab3c6979106d373a576'),
            this.gettextCatalog.getString('5845995e90336006981769bb'),
            this.gettextCatalog.getString('584ac7f39033602d65f6e131'),
            this.gettextCatalog.getString('5845ac509033600698176a62'),
            this.gettextCatalog.getString('58459880c6979106d373a4c2'),
            this.gettextCatalog.getString('5845990290336006981769b1'),
            this.gettextCatalog.getString('58459756903360069817698b'),
            this.gettextCatalog.getString('584597e6903360069817699d'),
            this.gettextCatalog.getString('584597a1c6979106d373a4b5'),
            this.gettextCatalog.getString('58471fd6903360069817752e')
        ]);
    }
    $onChanges() {
        this.$log.debug('selected contact: ', this.contacts.current);
    }
    save() {
        const source = angular.copy(this.contacts.current); //to avoid onChanges changes
        const target = angular.copy(this.contacts.initialState); //to avoid onChanges changes
        const patch = createPatch(target, source);
        this.$log.debug('contact patch', patch);

        return this.contacts.save(patch).then(() => {
            if (patch.tag_list) {
                const tags = patch.tag_list.split(',');
                this.$rootScope.$emit('contactTagsAdded', {tags: tags});
            }
            this.alerts.addAlert(this.gettextCatalog.getString('Changes saved successfully.'));
        }).catch(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Unable to save changes.'), 'danger');
        });
    }
    onPrimary(personId) {
        if (eq(get('primary_person.id', this.contacts.current), personId) || isNil(personId)) {
            return;
        }
        this.$log.debug('change primary: ', personId);
        this.contacts.current.primary_person.id = personId;
        this.save();
    }
    openLogTaskModal() {
        this.tasks.logModal(this.contacts.current.id);
    }
    openAddTaskModal() {
        this.tasks.addModal(this.contacts.current.id);
    }
    hideContact() {
        this.contacts.hideContact(this.contacts.current).then(() => {
            this.$state.go('contacts');
        });
    }
    displayNotes() {
        this.$anchorScroll('contact-tabs');
        this.setActiveTab('notes');
    }
    setActiveTab(tab) {
        this.activeTab = tab;
        if (tab === 'details') {
            this.$state.go(`contacts.show`);
        } else {
            this.$state.go(`contacts.show.${tab}`);
        }
    }
}

const Show = {
    controller: ContactController,
    template: require('./show.html')
};

export default angular.module('mpdx.contacts.show.component', [])
    .component('contact', Show).name;
