import config from "config";

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
            name: 'theKey',
            url: '/theKey',
            onEnter: ($window) => {
                $window.location.href = config.theKeyUrl;
            }
        });
    }
}