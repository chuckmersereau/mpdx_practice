import config from 'config';

export default class Routes {
    static config($stateProvider) {
        $stateProvider.state({
            name: 'root',
            abstract: true,
            template: '<div ui-view=""></div>',
            resolve: {
                userResolve: /*@ngInject*/ (users) => users.getCurrent()
            }
        }).state({
            name: 'home',
            url: '/',
            component: 'home',
            parent: 'root'
        }).state({
            name: 'login',
            url: '/login',
            component: 'login'
        }).state({
            name: 'auth',
            url: '/auth?access_token',
            onEnter: auth,
            resolve: {
                url: /*@ngInject*/ ($location) => $location.url($location.url().replace("#", "?"))
            }
        }).state({
            name: 'logout',
            url: '/logout',
            onEnter: logout
        }).state({
            name: 'contacts',
            title: 'Contacts',
            url: '/contacts',
            component: 'contacts',
            params: {
                filters: null
            },
            parent: 'root',
            resolve: {
                resolution: /*@ngInject*/ (contactFilter) => contactFilter.load(),
                another: /*@ngInject*/ (contactsTags) => contactsTags.load()
            }
        }).state({
            name: 'contact',
            title: 'Contact',
            url: '/contacts/{contactId}',
            component: 'contact',
            parent: 'root',
            resolve: {
                resolution: /*@ngInject*/ (contactFilter) => contactFilter.load(),
                another: /*@ngInject*/ (contactsTags) => contactsTags.load()
            }
        }).state({
            name: 'contact.address',
            url: '/addresses/{addressId}',
            onEnter: openAddressModal
        }).state({
            name: 'contact.merge_people',
            url: '/people/merge/:peopleIds',
            onEnter: openMergePeopleModal
        }).state({
            name: 'contacts.new',
            url: '/new',
            onEnter: openNewContactModal
        }).state({
            name: 'contact.person',
            url: '/people/{personId}',
            onEnter: openPeopleModal
        }).state({
            name: 'reports',
            url: '/reports',
            component: 'reports',
            parent: 'root'
        }).state({
            name: 'reports.balances',
            url: '/balances',
            component: 'balancesReport'
        }).state({
            name: 'reports.donations',
            url: '/donations',
            component: 'donationsReport'
        }).state({
            name: 'reports.donations.edit',
            url: '/edit/{donationId}',
            onEnter: openDonationModal
        }).state({
            name: 'reports.monthly',
            url: '/monthly',
            component: 'expectedMonthlyTotalsReport'
        }).state({
            name: 'reports.partner',
            url: '/partner',
            component: 'contributionsReport',
            resolve: {
                type: () => 'donor'
            }
        }).state({
            name: 'reports.salary',
            url: '/salary',
            component: 'contributionsReport',
            resolve: {
                type: () => 'salary'
            }
        }).state({
            name: 'preferences',
            title: 'Preferences',
            url: '/preferences',
            component: 'preferences',
            parent: 'root'
        }).state({
            name: 'preferences.accounts',
            title: 'Manage Accounts',
            url: '/accounts',
            component: 'accountPreferences'
        }).state({
            name: 'preferences.accounts.tab',
            title: 'Manage Accounts',
            url: '/{id}',
            component: 'accountPreferences'
        }).state({
            name: 'preferences.imports',
            title: 'Import Contacts',
            url: '/imports',
            component: 'importPreferences'
        }).state({
            name: 'preferences.imports.tab',
            title: 'Import Contacts',
            url: '/{id}',
            component: 'importPreferences'
        }).state({
            name: 'preferences.integrations',
            title: 'Connect Services',
            url: '/integrations',
            component: 'integrationPreferences'
        }).state({
            name: 'preferences.integrations.tab',
            title: 'Connect Services',
            url: '/{id}',
            component: 'integrationPreferences'
        }).state({
            name: 'preferences.notifications',
            title: 'Notifications',
            url: '/notifications',
            component: 'notificationPreferences'
        }).state({
            name: 'preferences.personal',
            title: 'Preferences',
            url: '/personal',
            component: 'personalPreferences'
        }).state({
            name: 'preferences.personal.tab',
            title: 'Preferences',
            url: '/{id}',
            component: 'personalPreferences'
        }).state({
            name: 'tasks',
            title: 'Tasks',
            url: '/tasks',
            component: 'tasks',
            parent: 'root',
            params: {
                filters: null
            },
            resolve: {
                resolution: /*@ngInject*/ (tasksFilter) => tasksFilter.load(),
                another: /*@ngInject*/ (tasksTags) => tasksTags.load()
            }
        }).state({
            name: 'tasks.new',
            url: '/new',
            onEnter: openNewTaskModal,
            resolve: {
                tags: /*@ngInject*/ (tasksTags) => tasksTags.load()
            }
        }).state({
            name: 'unavailable',
            title: 'Unavailable',
            url: '/unavailable',
            component: 'unavailable',
            parent: 'root'
        });
    }
}

/*@ngInject*/
function auth(
    $state, $stateParams, $window, $http, $log
) {
    if (!_.isEmpty($stateParams.access_token)) {
        $http({
            url: `${config.apiUrl}user/authentication`,
            method: 'post',
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            data: {
                access_token: $stateParams.access_token
            }
        }).then((data) => {
            $log.debug('user/authentication', data);
            $window.sessionStorage.token = data.data.json_web_token;
            const redirect = angular.copy($window.sessionStorage.redirect || 'home');
            delete $window.sessionStorage.redirect;
            $state.go(redirect, {}, {reload: true});
        });
    }
}

/*@ngInject*/
function logout($window, $state) {
    delete $window.sessionStorage.token;
    $state.go('login', {}, {reload: true});
}

/*@ngInject*/
function openAddressModal(
    $stateParams, modal, contacts, $state
) {
    contacts.find($stateParams.contactId).then((contact) => {
        const address = _.find(contact.addresses, addressToFilter => addressToFilter.id.toString() === $stateParams.addressId);

        modal.open({
            template: require('./contacts/show/address/modal/modal.html'),
            controller: 'addressModalController',
            locals: {
                contact: contact,
                address: address
            },
            onHide: () => {
                $state.go('^', {}, { reload: true });
            }
        });
    });
}

/*@ngInject*/
function openDonationModal($state, $stateParams, modal, donationsReport) {
    donationsReport.getDonations().then((data) => {
        let donation = _.find(data.donations, { id: parseInt($stateParams.donationId) });
        modal.open({
            template: require('./reports/donations/edit/edit.html'),
            controller: 'donationModalController',
            locals: {
                donation: donation
            },
            onHide: () => {
                $state.go('^', {}, { reload: true });
            }
        });
    });
}

/*@ngInject*/
function openPeopleModal($state, $stateParams, modal, contactPerson) {
    function modalOpen(contactId, person) {
        modal.open({
            template: require('./contacts/show/people/modal/modal.html'),
            controller: 'personModalController',
            locals: {
                contactId: contactId,
                person: person
            },
            onHide: () => {
                $state.go('contact', {contactId: contactId}, { reload: true });
            }
        });
    }
    if ($stateParams.personId === 'new') {
        modalOpen($stateParams.contactId, {});
    } else {
        contactPerson.get($stateParams.contactId, $stateParams.personId).then((person) => {
            modalOpen($stateParams.contactId, person);
        });
    }
}

/*@ngInject*/
function openMergePeopleModal(
    $state, $stateParams,
    modal, contacts
) {
    contacts.find($stateParams.contactId).then((contact) => {
        const peopleIds = $stateParams.peopleIds.split(',');
        const people = _.filter(contact.people, person => _.includes(peopleIds, person.id.toString()));

        modal.open({
            template: require('./contacts/show/people/merge/merge.html'),
            controller: 'mergePeopleModalController',
            locals: {
                contact: contact,
                people: people
            },
            onHide: () => {
                contacts.load(true);
                $state.go('^', {}, { reload: true });
            }
        });
    });
}

/*@ngInject*/
function openNewContactModal(
    modal, $state
) {
    modal.open({
        template: require('./contacts/new/new.html'),
        controller: 'contactNewModalController',
        onHide: () => {
            if ($state.current.name === 'contacts.new') {
                $state.go('^', {}, { reload: true });
            }
        }
    });
}

/*@ngInject*/
function openNewTaskModal(
  modal, $state
) {
    modal.open({
        template: require('./tasks/add/add.html'),
        controller: 'addTaskController',
        locals: {
            specifiedAction: null,
            specifiedSubject: null,
            selectedContacts: [],
            modalTitle: 'Add Task'
        },
        onHide: () => {
            if ($state.current.name === 'tasks.new') {
                $state.go('^', {}, { reload: true });
            }
        }
    });
}
