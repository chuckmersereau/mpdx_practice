/*@ngInject*/
export default function appRun(
    $q, $log, $rootScope, $state, $transitions, $window
) {
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUs23E_OsltKqLcIPD6B4rU11bfZKnM0";
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
    $transitions.onStart({ to: state => state.name !== 'login' && state.name !== 'auth' }, (trans) => {
        const users = trans.injector().get('users'); //load user service into transition
        return users.getCurrent(false, true).catch((error) => {
            if (error.redirect) {
                return trans.router.stateService.target(error.redirect);
            }
        });
    });
}
