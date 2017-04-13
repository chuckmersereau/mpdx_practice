import config from 'config';

export default class Routes {
    static config($stateProvider) {
        $stateProvider.state({
            name: 'root',
            abstract: true,
            component: 'root',
            resolve: {
                constants: /*@ngInject*/ (serverConstants) => serverConstants.load(),
                contactList: /*@ngInject*/ (contacts) => contacts.getList()
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
            component: 'auth',
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
                filter: /*@ngInject*/ ($stateParams, contactFilter) => {
                    return contactFilter.load().then(() => {
                        if ($stateParams.filters) {
                            contactFilter.reset($stateParams.filters);
                        }
                    });
                },
                tag: /*@ngInject*/ (contactsTags) => contactsTags.load()
            }
        }).state({
            name: 'contacts.show',
            title: 'Contact',
            url: '/{contactId}',
            component: 'contact',
            resolve: {
                again: /*@ngInject*/ (users) => users.listOrganizationAccounts(),
                contact: /*@ngInject*/ (contacts, $stateParams) => contacts.get($stateParams.contactId)
            }
        }).state({
            name: 'reports',
            url: '/reports',
            component: 'reports',
            parent: 'root'
        }).state({
            name: 'reports.balances',
            url: '/balances',
            component: 'balances'
        }).state({
            name: 'reports.donations',
            url: '/donations',
            component: 'donations',
            resolve: {
                byMonth: () => true
            },
            params: {
                startDate: null
            }
        }).state({
            name: 'reports.monthly',
            url: '/monthly',
            component: 'monthly'
        }).state({
            name: 'reports.partner',
            url: '/partner',
            component: 'contributions',
            resolve: {
                type: () => 'partner'
            }
        }).state({
            name: 'reports.salary',
            url: '/salary',
            component: 'contributions',
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
            component: 'preferencesAccounts',
            resolve: {
                resolution: /*@ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'preferences.integrations',
            title: 'Connect Services',
            url: '/integrations',
            component: 'preferencesIntegration',
            resolve: {
                resolution: /*@ngInject*/ (users) => users.listOrganizationAccounts()
            }
        }).state({
            name: 'preferences.notifications',
            title: 'Notifications',
            url: '/notifications',
            component: 'preferencesNotifications'
        }).state({
            name: 'preferences.personal',
            title: 'Preferences',
            url: '/personal',
            component: 'preferencesPersonal'
        }).state({
            name: 'setup',
            title: 'Setup',
            url: '/setup',
            component: 'setup',
            resolve: {
                constants: /*@ngInject*/ (serverConstants) => serverConstants.load()
            }
        }).state({
            name: 'setup.connect',
            title: 'Get Connected',
            url: '/connect',
            component: 'setupConnect',
            resolve: {
                resolution: /*@ngInject*/ (users) => users.listOrganizationAccounts(),
                another: /*@ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'setup.account',
            title: 'Setup Default Account',
            url: '/account',
            component: 'setupAccount',
            resolve: {
                resolution: /*@ngInject*/ (accounts) => accounts.load(true)
            }
        }).state({
            name: 'setup.google',
            title: 'Setup Google',
            url: '/google',
            component: 'setupGoogle'
        }).state({
            name: 'setup.preferences',
            abstract: true,
            component: 'setupPreferences'
        }).state({
            name: 'setup.preferences.accounts',
            title: 'Merge Accounts',
            url: '/preferences/accounts',
            component: 'setupPreferencesAccounts'
        }).state({
            name: 'setup.preferences.integrations',
            title: 'Integration',
            url: '/preferences/integration',
            component: 'setupPreferencesIntegrations'
        }).state({
            name: 'setup.preferences.notifications',
            title: 'Notifications',
            url: '/preferences/notifications',
            component: 'setupPreferencesNotifications'
        }).state({
            name: 'setup.preferences.personal',
            title: 'Preferences',
            url: '/preferences/personal',
            component: 'setupPreferencesPersonal'
        }).state({
            name: 'setup.start',
            title: 'Get Started',
            url: '/start',
            component: 'setupStart'
        }).state({
            name: 'setup.finish',
            title: 'Completed',
            url: '/finish',
            component: 'setupFinish'
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
                filter: /*@ngInject*/ ($stateParams, tasksFilter) => {
                    return tasksFilter.load().then(() => {
                        if ($stateParams.filters) {
                            tasksFilter.reset($stateParams.filters);
                        }
                    });
                },
                tag: /*@ngInject*/ (tasksTags) => tasksTags.load()
            }
        }).state({
            name: 'tools',
            title: 'Tools',
            url: '/tools',
            component: 'tools',
            parent: 'root',
            params: {
                setup: false
            }
        }).state({
            name: 'tools.importFromCSV',
            title: 'Import from CSV',
            url: '/import-from-csv',
            component: 'importFromCsv'
        }).state({
            name: 'tools.importFromGoogle',
            title: 'Import from Google',
            url: '/import-from-google',
            component: 'googleImportForm'
        }).state({
            name: 'tools.importFromTNT',
            title: 'Import from TNT',
            url: '/import-from-tnt',
            component: 'tntImportForm',
            resolve: {
                another: /*@ngInject*/ (contactsTags) => contactsTags.load()
            }
        }).state({
            name: 'tools.fixCommitmentInfo',
            title: 'Fix Commitment Info',
            url: '/fix-commitment-info',
            component: 'fixCommitmentInfo'
        }).state({
            name: 'tools.fix',
            abstract: true,
            component: 'fix',
            url: '/fix'
        }).state({
            name: 'tools.fix.phoneNumbers',
            title: 'Fix Phone Numbers',
            url: '/phone-numbers',
            component: 'fixPhoneNumbers',
            resolve: {
                0: /*@ngInject*/ (fixPhoneNumbers) => fixPhoneNumbers.load()
            }
        }).state({
            name: 'tools.fix.emailAddresses',
            title: 'Fix Email Addresses',
            url: '/email-addresses',
            component: 'fixEmailAddresses',
            resolve: {
                0: /*@ngInject*/ (fixEmailAddresses) => fixEmailAddresses.load()
            }
        }).state({
            name: 'tools.fix.addresses',
            title: 'Fix Addresses',
            url: '/addresses',
            component: 'fixAddresses',
            resolve: {
                0: /*@ngInject*/ (fixAddresses) => fixAddresses.load()
            }
        }).state({
            name: 'tools.mergeContacts',
            url: '/merge-contacts',
            component: 'mergeContacts',
            resolve: {
                0: /*@ngInject*/ (mergeContacts) => mergeContacts.load()
            }
        }).state({
            name: 'tools.mergePeople',
            url: '/merge-people',
            component: 'mergePeople',
            resolve: {
                0: /*@ngInject*/ (mergePeople) => mergePeople.load()
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
function logout(
    $window,
    users
) {
    $window.localStorage.removeItem('token');
    if (users.current) {
        $window.localStorage.removeItem(`${users.current.id}_accountListId`);
    }
    $window.location.href = config.authUrl + config.authLogout;
}
