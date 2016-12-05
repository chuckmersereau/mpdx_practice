export default class Routes {
    static config($stateProvider) {
        $stateProvider.state({
            name: 'home',
            url: '/',
            component: 'home'
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
            }
        }).state({
            name: 'contact',
            title: 'Contact',
            url: '/contacts/{contactId:[0-9]+}',
            component: 'contact'
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
            component: 'reports'
        }).state({
            name: 'reports.balances',
            url: '/balances',
            component: 'balancesReport'
        }).state({
            name: 'reports.donations',
            url: '/donations/{startDate}/{endDate}',
            component: 'donationsReport',
            params: {
                startDate: moment().startOf('month').format('l'),
                endDate: moment().endOf('month').format('l')
            },
            resolve: {
                startDate: /*@ngInject*/ ($stateParams) => $stateParams.startDate,
                endDate: /*@ngInject*/ ($stateParams) => $stateParams.endDate
            }
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
            component: 'preferences'
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
            component: 'tasks'
        }).state({
            name: 'unavailable',
            title: 'Unavailable',
            url: '/unavailable',
            component: 'unavailable'
        });
    }
}

/*@ngInject*/
function auth($state, $stateParams, $window, $location) {
    if (!_.isEmpty($stateParams.access_token)) {
        $window.sessionStorage.token = $stateParams.access_token;
        const redirect = angular.copy($window.sessionStorage.redirect || 'home');
        delete $window.sessionStorage.redirect;
        $location.$$search = {}; //clear querystring
        $state.go(redirect, {reload: true});
    }
}

/*@ngInject*/
function logout($window, $state) {
    delete $window.sessionStorage.token;
    $state.go('login', {reload: true});
}

/*@ngInject*/
function openAddressModal(
    $stateParams, modal, cache, $state
) {
    cache.get($stateParams.contactId).then((contact) => {
        const address = _.find(contact.addresses, addressToFilter => addressToFilter.id.toString() === $stateParams.addressId);

        modal.open({
            template: require('./contacts/show/address/modal/modal.html'),
            controller: 'addressModalController',
            locals: {
                contact: contact,
                address: address
            },
            onHide: () => {
                $state.go('^');
            }
        });
    });
}

/*@ngInject*/
function openDonationModal($state, $stateParams, modal) {
    modal.open({
        template: require('./reports/donationsReport/edit/edit.html'),
        controller: 'editDonationController',
        locals: {
            donationId: $stateParams.donationId
        },
        onHide: () => {
            $state.go('^', {}, { reload: true });
        }
    });
}

/*@ngInject*/
function openPeopleModal($state, $stateParams, modal, cache) {
    cache.get($stateParams.contactId).then((contact) => {
        const person = _.find(contact.people, person => person.id.toString() === $stateParams.personId);

        modal.open({
            template: require('./contacts/show/people/modal/modal.html'),
            controller: 'personModalController',
            locals: {
                contact: contact,
                person: person
            },
            onHide: () => {
                $state.go('^');
            }
        });
    });
}

/*@ngInject*/
function openMergePeopleModal(
    $state, $stateParams, modal, cache
) {
    cache.get($stateParams.contactId).then((contact) => {
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
                $state.go('^');
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
                $state.go('^');
            }
        }
    });
}
