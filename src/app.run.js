import config from 'config';

/*@ngInject*/
export default function appRun($transitions, $q, $window, $rootScope) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUs23E_OsltKqLcIPD6B4rU11bfZKnM0";
    $transitions.onBefore({ to: (state) => {
        if (state.name === 'login') {
            return false;
        } else if (!$window.sessionStorage.token) {
            $window.sessionStorage.redirect = state.name;
        }
        return true;
    } }, () => {
        if ($window.sessionStorage.token) {
            return $q.resolve();
        }
        $window.location.href = config.theKeyUrl;
        return $q.reject();
    });
}