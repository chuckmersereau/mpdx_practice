// do not disable angular debug in production. breaks daterangepicker
import config from './config';
import Routes from './routes';

/* @ngInject*/
export default function appConfig(
    $compileProvider, $locationProvider, $logProvider, $stateProvider, $httpProvider, $qProvider, $urlRouterProvider,
    blockUIConfig, jwtOptionsProvider, RollbarProvider, timeAgoSettings, gettext
) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|mailto):/);
    jwtOptionsProvider.config({
        tokenGetter: /* @ngInject*/  ($window) => {
            return $window.localStorage.getItem('token');
        },
        unauthenticatedRedirectPath: '/login',
        unauthenticatedRedirector: /* @ngInject*/ ($state, $location, $window) => {
            if ($location.path() !== '/login') {
                $window.localStorage.setItem('redirect', $location.path());
                $window.localStorage.setItem('params', JSON.stringify($location.search()));
            }
            $state.go('login');
        },
        whiteListedDomains: ['api.stage.mpdx.org', 'api.mpdx.org', 'localhost']
    });
    $httpProvider.interceptors.push('jwtInterceptor');
    $qProvider.errorOnUnhandledRejections(false); // hide ui-router 'Possibly unhandled rejection' and no-catch conditions
    $urlRouterProvider.otherwise('/unavailable');
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false
    }).hashPrefix('!');
    Routes.config($stateProvider, gettext);
    blockUIConfig.autoBlock = false;
    blockUIConfig.template = require('./blockUI/blockUI.html');
    $logProvider.debugEnabled(config.env === 'development');
    if (config.rollbarAccessToken) {
        RollbarProvider.init({
            accessToken: config.rollbarAccessToken,
            captureUncaught: true,
            payload: {
                environment: config.env,
                client: {
                    javascript: {
                        source_map_enabled: true,
                        code_version: process.env.TRAVIS_COMMIT,
                        guess_uncaught_frames: true
                    }
                }
            }
        });
    } else {
        RollbarProvider.deinit();
    }
    timeAgoSettings.strings['en_US'].suffixAgo = '';
}
