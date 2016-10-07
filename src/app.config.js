import Routes from "./routes";

export default function appConfig($locationProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        rewriteLinks: false
    }).hashPrefix('!');
    Routes.config($stateProvider);
}