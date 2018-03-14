import config from 'config';

export default class Routes {
    static config($stateProvider, gettext) {
        $stateProvider.state({
            name: 'root',
            abstract: true,
            component: 'root'
        }).state({
            name: 'home',
            title: gettext('Dashboard'),
            url: '/',
            component: 'home',
            parent: 'root',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['activity_hashes', 'organizations_attributes'])
            }
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
                url: /* @ngInject*/ ($location) => $location.url($location.url().replace('#', '?'))
            }
        }).state({
            name: 'acceptInvite',
            title: gettext('Accept Invite'),
            url: '/account_lists/{account_list_id}/accept_invite/{id}?code',
            component: 'acceptInvite',
            resolve: {
                url: /* @ngInject*/ ($location) => $location.url($location.url().replace('#', '?'))
            }
        }).state({
            name: 'logout',
            title: gettext('Logout'),
            url: '/logout',
            onEnter: logout
        }).state({
            name: 'coaches',
            title: gettext('Coaching Accounts'),
            url: '/coaches',
            component: 'coaches',
            parent: 'root'
        }).state({
            name: 'coaches.show',
            title: gettext('Coaching Account'),
            url: '/{accountId}',
            component: 'coachesShow'
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
                filter: /* @ngInject*/ ($stateParams, contactFilter) => {
                    return contactFilter.load().then(() => {
                        if ($stateParams.filters) {
                            contactFilter.reset($stateParams.filters);
                        }
                    });
                },
                tag: /* @ngInject*/ (contactsTags) => contactsTags.load(),
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['pledge_frequency_hashes'])
            }
        }).state({
            name: 'contacts.show',
            title: gettext('Contact'),
            url: '/{contactId}?personId&drawer',
            component: 'contact',
            params: {
                personId: null
            },
            resolve: {
                0: /* @ngInject*/ (users) => users.listOrganizationAccounts(),
                1: /* @ngInject*/ (serverConstants) =>
                    serverConstants.load([
                        'assignable_likely_to_give_hashes',
                        'assignable_send_newsletter_hashes',
                        'locales', 'pledge_currencies',
                        'pledge_frequency_hashes',
                        'status_hashes'
                    ]),
                contact: /* @ngInject*/ (contacts, $stateParams) =>
                    contacts.get($stateParams.contactId).then((data) => {
                        contacts.current = data;
                        contacts.initialState = angular.copy(data);
                        return data;
                    })
            }
        }).state({
            name: 'contacts.show.addresses',
            title: gettext('Contact - Addresses'),
            url: '/addresses',
            component: 'contactAddresses'
        }).state({
            name: 'contacts.show.details',
            title: gettext('Contact'),
            url: '/details',
            component: 'contactDetails',
            resolve: {
                contact: /* @ngInject*/ (contacts) => contacts.current,
                donorAccounts: /* @ngInject*/ (contacts) => contacts.current.donor_accounts
            }
        }).state({
            name: 'contacts.show.donations',
            title: gettext('Contact - Donations'),
            url: '/',
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
            name: 'contacts.show.people',
            title: gettext('Contact - People'),
            url: '/people',
            component: 'contactPeople'
        }).state({
            name: 'contacts.show.recommendation',
            title: gettext('Contact - Recommendation'),
            url: '/recommendation',
            component: 'contactRecommendation',
            resolve: {
                recommendation: /* @ngInject*/ (contacts, $stateParams) => {
                    return contacts.getRecommendation($stateParams.contactId);
                }
            }
        }).state({
            name: 'contacts.show.referrals',
            title: gettext('Contact - Referrals'),
            url: '/referrals',
            component: 'contactReferrals'
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
                type: () => 'partner',
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['pledge_currencies', 'pledge_frequency_hashes'])
            }
        }).state({
            name: 'reports.salary',
            title: gettext('Reports - Salary'),
            url: '/salary',
            component: 'contributions',
            resolve: {
                type: () => 'salary',
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['pledge_currencies', 'pledge_frequency_hashes'])
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
                0: /* @ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'preferences.admin',
            title: gettext('Preferences - Admin'),
            url: '/admin',
            component: 'preferencesAdmin'
        }).state({
            name: 'preferences.coaches',
            title: gettext('Preferences - Manage Coaches'),
            url: '/coaches',
            component: 'preferencesCoaches',
            resolve: {
                0: /* @ngInject*/ (accounts) => accounts.load()
            }
        }).state({
            name: 'preferences.integrations',
            title: gettext('Preferences - Connect Services'),
            url: '/integrations?selectedTab',
            component: 'preferencesIntegration',
            resolve: {
                0: /* @ngInject*/ (users) => users.listOrganizationAccounts(),
                1: /* @ngInject*/ (serverConstants) => serverConstants.load(['organizations_attributes'])
            },
            params: {
                selectedTab: null
            }
        }).state({
            name: 'preferences.notifications',
            title: gettext('Preferences - Notifications'),
            url: '/notifications',
            component: 'preferencesNotifications',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['notification_translated_hashes'])
            }
        }).state({
            name: 'preferences.personal',
            title: gettext('Preferences - Personal'),
            url: '/personal',
            component: 'preferencesPersonal',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['languages', 'locales', 'pledge_currencies'])
            }
        }).state({
            name: 'setup',
            title: gettext('Setup'),
            url: '/setup',
            component: 'setup',
            resolve: {
                constants: /* @ngInject*/ (serverConstants) => serverConstants.load(['organizations_attributes'])
            }
        }).state({
            name: 'setup.connect',
            title: gettext('Setup - Get Connected'),
            url: '/connect',
            component: 'setupConnect',
            resolve: {
                resolution: /* @ngInject*/ (users) => users.listOrganizationAccounts(),
                another: /* @ngInject*/ (accounts) => accounts.load(),
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['organizations_attributes'])
            }
        }).state({
            name: 'setup.account',
            title: gettext('Setup - Default Account'),
            url: '/account',
            component: 'setupAccount',
            resolve: {
                resolution: /* @ngInject*/ (accounts) => accounts.load(true)
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
            component: 'setupPreferencesIntegrations',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['organizations_attributes'])
            }
        }).state({
            name: 'setup.preferences.notifications',
            title: gettext('Setup - Preferences - Notifications'),
            url: '/preferences/notifications',
            component: 'setupPreferencesNotifications',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['notification_translated_hashes'])
            }
        }).state({
            name: 'setup.preferences.personal',
            title: gettext('Setup - Preferences - Personal'),
            url: '/preferences/personal',
            component: 'setupPreferencesPersonal',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['languages', 'locales', 'pledge_currencies'])
            }
        }).state({
            name: 'setup.start',
            title: gettext('Setup - Get Started'),
            url: '/start',
            component: 'setupStart',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['languages'])
            }
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
                filter: /* @ngInject*/ ($stateParams, tasksFilter) => {
                    return tasksFilter.load().then(() => {
                        tasksFilter.reset($stateParams.filters);
                    });
                },
                tag: /* @ngInject*/ (tasksTags) => tasksTags.load(),
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['assignable_send_newsletter_hashes',
                    'pledge_frequency_hashes', 'pledge_currencies', 'pledge_frequency_hashes', 'status_hashes'])
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
            name: 'tools.appeals',
            url: '/appeals',
            component: 'appeals',
            title: gettext('Appeals'),
            resolve: {
                0: /* @ngInject*/ (contactsTags) => contactsTags.load(),
                2: /* @ngInject*/ (contactFilter) => contactFilter.load()
            }
        }).state({
            name: 'tools.appeals.show',
            url: '/{appealId}',
            title: gettext('Goal'),
            component: 'appealsShow',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['pledge_currencies', 'pledge_frequency_hashes']),
                1: /* @ngInject*/ (mailchimp) => mailchimp.load(),
                data: /* @ngInject*/ (appealsShow, $stateParams) => appealsShow.getAppeal($stateParams.appealId)
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
            component: 'importCsv',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['csv_import'])
            }
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
                0: /* @ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId)
            }
        }).state({
            name: 'tools.import.csv.values',
            title: gettext('Tools - Import - CSV - Values'),
            url: '/values/:importId',
            component: 'importCsvValues',
            resolve: {
                0: /* @ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId)
            }
        }).state({
            name: 'tools.import.csv.preview',
            title: gettext('Tools - Import - CSV - Preview'),
            url: '/preview/:importId',
            component: 'importCsvPreview',
            resolve: {
                0: /* @ngInject*/ ($stateParams, importCsv) => importCsv.get($stateParams.importId),
                1: /* @ngInject*/ (serverConstants) => serverConstants.load(['pledge_frequency_hashes'])
            }
        }).state({
            name: 'tools.import.google',
            title: gettext('Tools - Import - Google'),
            url: '/google',
            component: 'importGoogle',
            resolve: {
                0: /* @ngInject*/ (contactsTags) => contactsTags.load(),
                1: /* @ngInject*/ (google) => google.load()
            }
        }).state({
            name: 'tools.import.tnt',
            title: gettext('Tools - Import - TNT'),
            url: '/tnt',
            component: 'importTnt',
            resolve: {
                0: /* @ngInject*/ (serverConstants) => serverConstants.load(['tnt_import']),
                1: /* @ngInject*/ (contactsTags) => contactsTags.load()
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
                0: /* @ngInject*/ (serverConstants, fixCommitmentInfo) =>
                    serverConstants.load(['pledge_currencies', 'pledge_frequency_hashes', 'status_hashes']).then(() =>
                        fixCommitmentInfo.load()
                    )
            }
        }).state({
            name: 'tools.fix.sendNewsletter',
            title: gettext('Tools - Fix - Send Newsletter'),
            url: '/send-newsletter',
            component: 'fixSendNewsletter',
            resolve: {
                0: /* @ngInject*/  (serverConstants, fixSendNewsletter) =>
                    serverConstants.load(['assignable_send_newsletter_hashes']).then(() =>
                        fixSendNewsletter.load()
                    )
            }
        }).state({
            name: 'tools.fix.phoneNumbers',
            title: gettext('Tools - Fix - Phone Numbers'),
            url: '/phone-numbers',
            component: 'fixPhoneNumbers',
            resolve: {
                0: /* @ngInject*/ (fixPhoneNumbers) => fixPhoneNumbers.load()
            }
        }).state({
            name: 'tools.fix.emailAddresses',
            title: gettext('Tools - Fix - Email Addresses'),
            url: '/email-addresses',
            component: 'fixEmailAddresses',
            resolve: {
                0: /* @ngInject*/ (fixEmailAddresses) => fixEmailAddresses.load()
            }
        }).state({
            name: 'tools.fix.addresses',
            title: gettext('Tools - Fix - Addresses'),
            url: '/addresses',
            component: 'fixAddresses'
        }).state({
            name: 'tools.merge',
            title: gettext('Tools - Merge'),
            abstract: true,
            component: 'fix',
            url: '/merge'
        }).state({
            name: 'tools.merge.contacts',
            title: gettext('Tools - Merge Contacts'),
            url: '/contacts',
            component: 'mergeContacts'
        }).state({
            name: 'tools.merge.people',
            title: gettext('Tools - Merge People'),
            url: '/people',
            component: 'mergePeople'
        }).state({
            name: 'unavailable',
            title: gettext('Unavailable'),
            url: '/unavailable',
            component: 'unavailable',
            parent: 'root'
        });
    }
}

/* @ngInject*/
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
