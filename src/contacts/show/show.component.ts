import 'angular-block-ui';
import 'angular-gettext';
import { assign, concat, eq, find, forEachRight, get, has, isNil, map, reject, set } from 'lodash/fp';
import { ContactsTagsService } from '../sidebar/filter/tags/tags.service';
import { StateParams, StateService } from '@uirouter/core';
import contactFilter, { ContactFilterService } from '../sidebar/filter/filter.service';
import contacts, { ContactsService } from '../contacts.service';
import createPatch from '../../common/fp/createPatch';
import help, { HelpService } from '../../common/help/help.service';
import joinComma from '../../common/fp/joinComma';
import modal, { ModalService } from '../../common/modal/modal.service';
import people, { PeopleService } from './people/people.service';
import session, { SessionService } from '../../common/session/session.service';
import uiRouter, { Transition, TransitionService } from '@uirouter/angularjs';
import users, { UsersService } from '../../common/users/users.service';

interface ICustomRootScope extends ng.IRootScopeService {
    pageTitle: string;
}

class ContactController {
    blockUI: IBlockUIService;
    moveContact: any;
    sortableOptions: any;
    tabsLabels: any[];
    watcher: () => void;
    watcher2: () => void;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ICustomRootScope,
        private $state: StateService,
        private $stateParams: StateParams,
        private $transitions: TransitionService,
        private $anchorScroll: ng.IAnchorScrollService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        help: HelpService,
        private contactFilter: ContactFilterService,
        private contacts: ContactsService,
        private contactsTags: ContactsTagsService,
        private modal: ModalService,
        private people: PeopleService,
        private session: SessionService,
        private users: UsersService
    ) {
        this.blockUI = blockUI.instances.get('contactShow');

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
            containment: '.contact-tabs .horizontal-tab-sortable',
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

        this.$transitions.onStart({ to: 'contacts.show.*' }, (transition) => {
            this.setActiveTab(transition);
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
    setActiveTab(transition: Transition) {
        let tab = transition.to().name.replace('contacts.show.', '');
        this.contacts.activeTab = tab;
        if (this.contacts.activeDrawer === tab) {
            this.contacts.activeDrawer = '';
        }
    }
    setActiveDrawer(tab: string) {
        this.contacts.activeDrawer = tab;
        if (tab === this.contacts.activeTab) {
            this.$state.go('contacts.show.donations');
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

export default angular.module('mpdx.contacts.show.component', [
    'blockUI', 'gettext', uiRouter,
    help, modal, contacts, contactFilter, people, users, session
])
    .component('contact', Show).name;
