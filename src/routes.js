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
                default: /*@ngInject*/ (contacts) => contacts.load(),
                resolution: /*@ngInject*/ (contactFilter) => contactFilter.load(),
                another: /*@ngInject*/ (contactsTags) => contactsTags.load(),
                again: /*@ngInject*/ (contactReconciler) => contactReconciler.fetchAll(),
                mas: /*@ngInject*/ (contacts) => {
                    contacts.getFilteredList();
                    return true;// make async
                }
            }
        }).state({
            name: 'contacts.reconcile_partners',
            url: '/reconcile-partners',
            component: 'contactsReconcilePartners'
        }).state({
            name: 'contacts.reconcile_individuals',
            url: '/reconcile-individuals',
            component: 'contactsReconcileIndividuals'
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
            component: 'donations'
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
            component: 'preferencesAccounts'
        }).state({
            name: 'preferences.integrations',
            title: 'Connect Services',
            url: '/integrations',
            component: 'integrationPreferences',
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
                resolution: /*@ngInject*/ (users) => users.listOrganizationAccounts()
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
                resolution: /*@ngInject*/ (tasksFilter) => tasksFilter.load(),
                another: /*@ngInject*/ (tasksTags) => tasksTags.load()
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
            component: 'csvImportForm'
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
            name: 'unavailable',
            title: 'Unavailable',
            url: '/unavailable',
            component: 'unavailable',
            parent: 'root'
        });
    }
}

/*@ngInject*/
function logout($window) {
    delete $window.sessionStorage.token;
    $window.location.href = `${config.authUrl}logout`;
}
