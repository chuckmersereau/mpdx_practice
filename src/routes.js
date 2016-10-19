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