import config from "config";

export default class Routes {
    static config($stateProvider) {
        $stateProvider.state({
            name: 'home',
            url: '/',
            component: 'home'
        }).state({
            name: 'login',
            url: '/login?access_token',
            onEnter: login,
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
        }).state({
            name: 'tasks',
            title: 'Tasks',
            url: '/tasks',
            component: 'tasks'
        });
    }
}

/*@ngInject*/
function login($state, $stateParams, $window, $location) {
    if (!_.isEmpty($stateParams.access_token)) {
        $window.sessionStorage.token = $stateParams.access_token;
        const redirect = angular.copy($window.sessionStorage.redirect || 'home');
        delete $window.sessionStorage.redirect;
        $location.$$search = {}; //clear querystring
        $state.go(redirect, {reload: true});
    }
}

/*@ngInject*/
function logout($window) {
    delete $window.sessionStorage.token;
    $window.location.href = config.theKeyUrl;
}

/*@ngInject*/
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
