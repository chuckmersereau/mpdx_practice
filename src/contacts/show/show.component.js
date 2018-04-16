import { assign, concat, defaultTo, eq, find, forEachRight, get, has, isNil, map, reject, set } from 'lodash/fp';
import createPatch from 'common/fp/createPatch';
import joinComma from 'common/fp/joinComma';

class ContactController {
    constructor(
        $log, $rootScope, $state, $stateParams, $anchorScroll, blockUI, gettextCatalog, help,
        contactFilter, contacts, contactsTags, modal, people, session, users
    ) {
        this.$anchorScroll = $anchorScroll;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.blockUI = blockUI.instances.get('contactShow');
        this.contactsTags = contactsTags;
        this.contacts = contacts;
        this.contactFilter = contactFilter;
        this.gettextCatalog = gettextCatalog;
        this.modal = modal;
        this.people = people;
        this.users = users;
        this.session = session;

        if ($stateParams['personId']) {
            this.people.openPeopleModal(this.contacts.current, $stateParams['personId']);
        }

        this.moveContact = { previous_contact: 0, following_contact: 0 };

        let tabsLabels = [
            { key: 'details', value: gettextCatalog.getString('Details'), drawerable: true },
            { key: 'donations', value: gettextCatalog.getString('Donations') },
            { key: 'addresses', value: gettextCatalog.getString('Addresses'), drawerable: true },
            { key: 'people', value: gettextCatalog.getString('People'), drawerable: true },
            { key: 'tasks', value: gettextCatalog.getString('Tasks'), drawerable: true },
            { key: 'referrals', value: gettextCatalog.getString('Referrals'), drawerable: true },
            { key: 'notes', value: gettextCatalog.getString('Notes'), drawerable: true }
        ];

        if (this.showRecommendationTab()) {
            tabsLabels.push(
                { key: 'recommendation', value: gettextCatalog.getString('Recommendations') }
            );
        }

        if (has('currentOptions.contact_tabs_sort', users)) {
            forEachRight((tab) => {
                const label = find({ key: tab }, tabsLabels);
                if (label) {
                    tabsLabels = reject({ key: tab }, tabsLabels);
                    tabsLabels = concat(label, tabsLabels);
                }
            }, users.currentOptions.contact_tabs_sort.value.split(','));
        }

        this.tabsLabels = tabsLabels;

        this.sortableOptions = {
            containment: '#contact-tabs .horizontal-tab-sortable',
            // restrict move across columns. move only within column.
            accept: (sourceItemHandleScope, destSortableScope) =>
                sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id,
            orderChanged: (event) => {
                let newIndex = event.dest.index;
                this.contacts.activeTab = this.tabsLabels[newIndex]['key'];

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
    $onInit() {
        this.setActiveDrawer(this.contacts.activeDrawer);

        if (this.contacts.activeTab !== 'donations') {
            this.$state.go(`contacts.show.${this.contacts.activeTab}`);
        }

        this.watcher = this.$rootScope.$on('accountListUpdated', () => {
            this.$state.go('contacts');
        });
        this.watcher2 = this.$rootScope.$on('changePrimaryPerson', (e, personId) => {
            this.onPrimary(personId);
        });
    }
    $onChanges() {
        this.$log.debug('selected contact: ', this.contacts.current);
        this.$rootScope.pageTitle = `${this.gettextCatalog.getString('Contact')} | ${this.contacts.current.name}`;
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
    }
    save() {
        const source = angular.copy(this.contacts.current); // to avoid onChanges changes
        const target = angular.copy(this.contacts.initialState); // to avoid onChanges changes
        const patch = createPatch(target, source);
        this.$log.debug('contact patch', patch);
        const errorMessage = this.gettextCatalog.getString('Unable to save changes.');
        const successMessage = this.gettextCatalog.getString('Changes saved successfully.');

        return this.contacts.save(patch, successMessage, errorMessage).then(() => {
            if (patch.tag_list) {
                const tags = patch.tag_list.split(',');
                this.$rootScope.$emit('contactTagsAdded', { tags: tags });
                this.contactsTags.addTag({ tags: tags });
            }
            if (patch.id === this.contacts.initialState.id) {
                this.contacts.initialState = assign(this.contacts.initialState, patch);
            }
        });
    }
    onPrimary(personId) {
        if (eq(get('primary_person.id', this.contacts.current), personId) || isNil(personId)) {
            return;
        }
        this.$log.debug('change primary: ', personId);
        this.contacts.current = set('primary_person.id', personId, this.contacts.current);
        this.save();
    }
    setActiveTab(tab) {
        this.contacts.activeTab = tab;
        if (tab === this.contacts.activeDrawer && tab !== 'details') { // collapsed case on details
            this.setActiveDrawer('details');
        }
        this.$state.go(`contacts.show.${tab}`);
    }
    setActiveDrawer(tab) {
        this.contacts.activeDrawer = tab;
        if (tab === this.contacts.activeTab) {
            this.setActiveTab('donations');
        }
    }
    showRecommendationTab() {
        return find((organizationAccount) => {
            return organizationAccount.organization.name === 'Cru - USA';
        }, this.users.organizationAccounts)
            && this.users.current.preferences.admin;
    }
}

const Show = {
    controller: ContactController,
    template: require('./show.html')
};

import blockUI from 'angular-block-ui';
import contacts from '../contacts.service';
import contactFilter from '../sidebar/filter/filter.service';
import gettextCatalog from 'angular-gettext';
import help from 'common/help/help.service';
import modal from 'common/modal/modal.service';
import people from './people/people.service';
import uiRouter from '@uirouter/angularjs';
import users from 'common/users/users.service';
import session from 'common/session/session.service';

export default angular.module('mpdx.contacts.show.component', [
    blockUI, gettextCatalog, uiRouter,
    help, modal, contacts, contactFilter, people, users, session
])
    .component('contact', Show).name;
