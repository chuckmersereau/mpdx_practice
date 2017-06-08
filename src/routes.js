import config from 'config';

export default class Routes {
    static config($stateProvider, gettext) {
        $stateProvider.state({
            name: 'root',
            abstract: true,
            component: 'root',
            resolve: {
                constants: /*@ngInject*/ (serverConstants) => serverConstants.load()
            }
        }).state({
            name: 'home',
            title: gettext('Home'),
            url: '/',
            component: 'home',
            parent: 'root'
        }).state({
            name: 'login',
            title: gettext('Login'),
            url: '/login',
            component: 'login'
        }).state({
            name: 'auth',
            title: gettext('Auth'),
            url: '/auth?access_token',
            component: 'auth',
            resolve: {
                url: /*@ngInject*/ ($location) => $location.url($location.url().replace("#", "?"))
            }
        }).state({
            name: 'logout',
            title: gettext('Logout'),
            url: '/logout',
            onEnter: logout
        }).state({
            name: 'contacts',
            title: gettext('Contacts'),
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
            title: gettext('Contact'),
            url: '/{contactId}?personId',
            component: 'contact',
            params: {
                personId: null
            },
            resolve: {
                again: /*@ngInject*/ (users) => users.listOrganizationAccounts(),
                contact: /*@ngInject*/ (contacts, $stateParams) => contacts.get($stateParams.contactId).then((data) => {
                    contacts.current = data;
                    contacts.initialState = angular.copy(data);
                    return data;
                })
            }
        }).state({
            name: 'contacts.show.donations',
            title: gettext('Contact - Donations'),
            url: '/donations',
            component: 'donations',
            resolve: {
                inContact: () => true
            }
        }).state({
            name: 'contacts.show.notes',
            title: gettext('Contact - Notes'),
            url: '/notes',
            component: 'contactNotes'
        }).state({
            name: 'contacts.show.referrals',
            title: gettext('Contact - Referrals'),
            url: '/referrals',
            component: 'contactReferrals',
            resolve: {
                referrals: /*@ngInject*/ (contacts, $stateParams) => contacts.getReferrals($stateParams.contactId)
            }
        }).state({
            name: 'contacts.show.tasks',
            title: gettext('Contact - Tasks'),
            url: '/tasks',
            component: 'contactTasks'
        }).state({
            name: 'reports',
            title: gettext('Reports'),
            url: '/reports',
            component: 'reports',
            parent: 'root'
        }).state({
            name: 'reports.balances',
            title: gettext('Reports - Balances'),
            url: '/balances',
            component: 'balances'
        }).state({
            name: 'reports.donations',
            title: gettext('Reports - Donations'),
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
            title: gettext('Reports - Monthly'),
            url: '/monthly',
            component: 'monthly'
        }).state({
            name: 'reports.partner',
            title: gettext('Reports - Partner'),
            url: '/partner',
            component: 'contributions',
            resolve: {
                type: () => 'partner'
            }
        }).state({
            name: 'reports.salary',
            title: gettext('Reports - Salary'),
            url: '/salary',
            component: 'contributions',
            resolve: {
                type: () => 'salary'
            }
        }).state({
            name: 'preferences',
            title: gettext('Preferences'),
            url: '/preferences',
            component: 'preferences',
            parent: 'root'
        }).state({
            name: 'preferences.accounts',
            title: gettext('Preferences - Manage Accounts'),
            url: '/accounts',
            component: 'preferencesAccounts',
            resolve: {
                resolution: /*@ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'preferences.integrations',
            title: gettext('Preferences - Connect Services'),
            url: '/integrations?selectedTab',
            component: 'preferencesIntegration',
            resolve: {
                resolution: /*@ngInject*/ (users) => users.listOrganizationAccounts()
            },
            params: {
                selectedTab: null
            }
        }).state({
            name: 'preferences.notifications',
            title: gettext('Preferences - Notifications'),
            url: '/notifications',
            component: 'preferencesNotifications'
        }).state({
            name: 'preferences.personal',
            title: gettext('Preferences - Personal'),
            url: '/personal',
            component: 'preferencesPersonal'
        }).state({
            name: 'setup',
            title: gettext('Setup'),
            url: '/setup',
            component: 'setup',
            resolve: {
                constants: /*@ngInject*/ (serverConstants) => serverConstants.load()
            }
        }).state({
            name: 'setup.connect',
            title: gettext('Setup - Get Connected'),
            url: '/connect',
            component: 'setupConnect',
            resolve: {
                resolution: /*@ngInject*/ (users) => users.listOrganizationAccounts(),
                another: /*@ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'setup.account',
            title: gettext('Setup - Default Account'),
            url: '/account',
            component: 'setupAccount',
            resolve: {
                resolution: /*@ngInject*/ (accounts) => accounts.load(true)
            }
        }).state({
            name: 'setup.google',
            title: gettext('Setup - Google'),
            url: '/google',
            component: 'setupGoogle'
        }).state({
            name: 'setup.preferences',
            title: gettext('Setup - Preferences'),
            abstract: true,
            component: 'setupPreferences'
        }).state({
            name: 'setup.preferences.accounts',
            title: gettext('Setup - Preferences - Merge Accounts'),
            url: '/preferences/accounts',
            component: 'setupPreferencesAccounts'
        }).state({
            name: 'setup.preferences.integrations',
            title: gettext('Setup - Preferences - Integrations'),
            url: '/preferences/integration',
            component: 'setupPreferencesIntegrations'
        }).state({
            name: 'setup.preferences.notifications',
            title: gettext('Setup - Preferences - Notifications'),
            url: '/preferences/notifications',
            component: 'setupPreferencesNotifications'
        }).state({
            name: 'setup.preferences.personal',
            title: gettext('Setup - Preferences - Personal'),
            url: '/preferences/personal',
            component: 'setupPreferencesPersonal'
        }).state({
            name: 'setup.start',
            title: gettext('Setup - Get Started'),
            url: '/start',
            component: 'setupStart'
        }).state({
            name: 'setup.finish',
            title: gettext('Setup - Completed'),
            url: '/finish',
            component: 'setupFinish'
        }).state({
            name: 'tasks',
            title: gettext('Tasks'),
            url: '/tasks',
            component: 'tasks',
            parent: 'root',
            params: {
                filters: null
            },
            resolve: {
                filter: /*@ngInject*/ ($stateParams, tasksFilter) => {
                    return tasksFilter.load().then(() => {
                        tasksFilter.reset($stateParams.filters);
                    });
                },
                tag: /*@ngInject*/ (tasksTags) => tasksTags.load()
            }
        }).state({
            name: 'tools',
            title: gettext('Tools'),
            url: '/tools',
            component: 'tools',
            parent: 'root',
            params: {
                setup: false
            }
        }).state({
            name: 'tools.import',
            title: gettext('Tools - Import'),
            abstract: true,
            component: 'import',
            url: '/import'
        }).state({
            name: 'tools.import.csv',
            title: gettext('Tools - Import - CSV'),
            url: '/csv',
            component: 'importCsv'
        }).state({
            name: 'tools.import.csv.upload',
            title: gettext('Tools - Import - CSV - Upload'),
            url: '/upload',
            component: 'importCsvUpload'
        }).state({
            name: 'tools.import.csv.headers',
            title: gettext('Tools - Import - CSV - Headers'),
            url: '/headers/:importId',
            component: 'importCsvHeaders',
            resolve: {
                0: /*@ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId)
            }
        }).state({
            name: 'tools.import.csv.values',
            title: gettext('Tools - Import - CSV - Values'),
            url: '/values/:importId',
            component: 'importCsvValues',
            resolve: {
                0: /*@ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId)
            }
        }).state({
            name: 'tools.import.csv.preview',
            title: gettext('Tools - Import - CSV - Preview'),
            url: '/preview/:importId',
            component: 'importCsvPreview',
            resolve: {
                0: /*@ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId)
            }
        }).state({
            name: 'tools.import.google',
            title: gettext('Tools - Import - Google'),
            url: '/google',
            component: 'importGoogle'
        }).state({
            name: 'tools.import.tnt',
            title: gettext('Tools - Import - TNT'),
            url: '/tnt',
            component: 'importTnt',
            resolve: {
                another: /*@ngInject*/ (contactsTags) => contactsTags.load()
            }
        }).state({
            name: 'tools.fix',
            title: gettext('Tools - Fix'),
            abstract: true,
            component: 'fix',
            url: '/fix'
        }).state({
            name: 'tools.fix.commitmentInfo',
            title: gettext('Tools - Fix - Commitment Info'),
            url: '/commitment-info',
            component: 'fixCommitmentInfo',
            resolve: {
                0: /*@ngInject*/ (fixCommitmentInfo) => fixCommitmentInfo.load()
            }
        }).state({
            name: 'tools.fix.phoneNumbers',
            title: gettext('Tools - Fix - Phone Numbers'),
            url: '/phone-numbers',
            component: 'fixPhoneNumbers',
            resolve: {
                0: /*@ngInject*/ (fixPhoneNumbers) => fixPhoneNumbers.load()
            }
        }).state({
            name: 'tools.fix.emailAddresses',
            title: gettext('Tools - Fix - Email Addresses'),
            url: '/email-addresses',
            component: 'fixEmailAddresses',
            resolve: {
                0: /*@ngInject*/ (fixEmailAddresses) => fixEmailAddresses.load()
            }
        }).state({
            name: 'tools.fix.addresses',
            title: gettext('Tools - Fix - Addresses'),
            url: '/addresses',
            component: 'fixAddresses',
            resolve: {
                0: /*@ngInject*/ (fixAddresses) => fixAddresses.load()
            }
        }).state({
            name: 'tools.mergeContacts',
            title: gettext('Tools - Merge Contacts'),
            url: '/merge-contacts',
            component: 'mergeContacts',
            resolve: {
                0: /*@ngInject*/ (mergeContacts) => mergeContacts.load()
            }
        }).state({
            name: 'tools.mergePeople',
            title: gettext('Tools - Merge People'),
            url: '/merge-people',
            component: 'mergePeople',
            resolve: {
                0: /*@ngInject*/ (mergePeople) => mergePeople.load()
            }
        }).state({
            name: 'unavailable',
            title: gettext('Unavailable'),
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
    delete $window.digitalData.user[0].profile[0].profileInfo.ssoGuid;
}
