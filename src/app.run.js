/*@ngInject*/
export default function appRun($transitions, $q, $window, $rootScope, $state) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUs23E_OsltKqLcIPD6B4rU11bfZKnM0";
    //check for Auth
    $transitions.onBefore({ to: (state) => {
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
