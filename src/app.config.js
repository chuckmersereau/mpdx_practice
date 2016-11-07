import config from 'config';

import Routes from "./routes";
/*@ngInject*/
export default function appConfig($analyticsProvider, $locationProvider, $stateProvider, $httpProvider) {
    if (config.env !== 'production') {
        $analyticsProvider.virtualPageviews(false);
    }
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false
    }).hashPrefix('!');
    Routes.config($stateProvider);
    $httpProvider.interceptors.push('authInterceptor');
}