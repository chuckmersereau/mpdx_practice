/*@ngInject*/
export default function appRun(
    $q, $log, $rootScope, $state, $transitions, $window
) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUs23E_OsltKqLcIPD6B4rU11bfZKnM0";
    $state.defaultErrorHandler = function() { /* do nothing */ };
    //check for Auth
    $transitions.onBefore({ to: (state) => {
        $log.debug('navigating to:', state.name);
        if (state.name === 'login' || state.name === 'auth') {
            return false;
        } else if (!$window.sessionStorage.token) {
            $window.sessionStorage.redirect = state.name;
        }
        return true;
    } }, () => {
        if ($window.sessionStorage.token) {
            return $q.resolve();
        }
        $state.go('login');
        return $q.reject();
    });
}
