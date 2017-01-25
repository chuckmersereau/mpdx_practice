import config from 'config';

import Routes from "./routes";
/*@ngInject*/
export default function appConfig($analyticsProvider, $locationProvider, $logProvider, $stateProvider, $httpProvider, $urlRouterProvider, blockUIConfig) {
    if (config.env !== 'production') {
        $analyticsProvider.virtualPageviews(false);
    }
    $urlRouterProvider.otherwise('/unavailable');
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false
    }).hashPrefix('!');
    Routes.config($stateProvider);
    $httpProvider.interceptors.push('authInterceptor');
    blockUIConfig.autoBlock = false;
    blockUIConfig.template = require('./blockUI/blockUI.html');
    $logProvider.debugEnabled(config.env === 'development');
}