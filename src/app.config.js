import config from 'config';

import Routes from "./routes";
/*@ngInject*/
export default function appConfig(
    $analyticsProvider, $locationProvider, $logProvider, $stateProvider, $httpProvider, $qProvider, $urlRouterProvider,
    blockUIConfig, RollbarProvider
) {
    if (config.env !== 'production' && config.env !== 'next') {
        $analyticsProvider.virtualPageviews(false);
    }
    $qProvider.errorOnUnhandledRejections(false); // hide ui-router 'Possibly unhandled rejection' and no-catch conditions
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
    if (config.rollbarAccessToken) {
        RollbarProvider.init({
            accessToken: config.rollbarAccessToken,
            captureUncaught: true,
            payload: {
                environment: config.env
            }
        });
    } else {
        RollbarProvider.deinit();
    }
}
