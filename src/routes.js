export default class Routes {
    static config($stateProvider) {
        $stateProvider.state({
            name: 'home',
            url: '/',
            component: 'home'
        }).state({
            name: 'login',
            url: '/login?ticket&redirect',
            onEnter: ($state, $stateParams, $window) => {
                $window.sessionStorage.ticket = $stateParams.ticket;
                $state.go($stateParams.redirect || 'home');
            }
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
        }).state('contact.person', {
            url: '/people/{personId}',
            onEnter: openPeopleModal
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
        });
    }
}

function openPeopleModal($state, $stateParams, modal, cache) {
    cache.get($stateParams.contactId).then((contact) => {
        const person = _.find(contact.people, function(person) {
            return person.id.toString() === $stateParams.personId;
        });

        modal.open({
            contentTemplate: '/contacts/show/personModal/personModal.html',
            controller: 'personModalController',
            locals: {
                contact: contact,
                person: person
            },
            onHide: function() {
                $state.go('^');
            }
        });
    });
}