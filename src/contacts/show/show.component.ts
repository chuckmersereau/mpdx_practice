import 'angular-block-ui';
import 'angular-gettext';
import { concat, defaultTo, eq, find, get, has, isNil, map, reduce, set, unionBy } from 'lodash/fp';
import { ContactsTagsService } from '../sidebar/filter/tags/tags.service';
import { split } from '../../common/fp/strings';
import { StateParams, StateService } from '@uirouter/core';
import contactFilter, { ContactFilterService } from '../sidebar/filter/filter.service';
import contacts, { ContactsService } from '../contacts.service';
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
    watcher3: Function;
    watcher4: () => void;
    constructor(
        private $log: ng.ILogService,
        private $rootScope: ICustomRootScope,
        private $state: StateService,
        private $stateParams: StateParams,
        private $transitions: TransitionService,
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
        const activeTab = get('[2]', split('.', $state.$current.name));
        contacts.activeTab = defaultTo('donations', activeTab);
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

        if (has('currentOptions.contact_tabs_sort', users)) {
            const newLabels = reduce((result, value) => {
                const label = find({ key: value }, tabsLabels);
                return label ? concat(result, label) : result;
            }, [], split(',', users.currentOptions.contact_tabs_sort.value));
            tabsLabels = unionBy('key', newLabels, tabsLabels);
        }

        this.tabsLabels = tabsLabels;

        this.sortableOptions = {
            containment: '.contact-tabs .horizontal-tab-sortable',
            // restrict move across columns. move only within column.
            accept: (sourceItemHandleScope, destSortableScope) =>
                sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id,
            orderChanged: (event) => {
                const newIndex = event.dest.index;
                this.contacts.activeTab = this.tabsLabels[newIndex]['key'];

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

        this.watcher3 = this.$transitions.onStart({ to: 'contacts.show.*' }, (transition) => {
            this.setActiveTab(transition);
        });

        this.watcher4 = this.$rootScope.$on('taskDrawerOpened', () => {
            this.setActiveDrawer(null);
        });
    }
    $onChanges() {
        this.$log.debug('selected contact: ', this.contacts.current);
        this.$rootScope.pageTitle = `${this.gettextCatalog.getString('Contact')} | ${this.contacts.current.name}`;
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
        this.watcher3();
        this.watcher4();
    }
    onPrimary(personId) {
        if (eq(get('primary_person.id', this.contacts.current), personId) || isNil(personId)) {
            return;
        }
        this.$log.debug('change primary: ', personId);
        this.contacts.current = set('primary_person.id', personId, this.contacts.current);
        this.contacts.saveCurrent();
    }
    setActiveTab(transition: Transition) {
        const tab = transition.to().name.replace('contacts.show.', '');
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
