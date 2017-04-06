/*@ngInject*/
export default function appRun(
    $q, $log, $rootScope, $state, $transitions, $window, blockUI
) {
    const block = blockUI.instances.get('root');
    $rootScope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBIUs23E_OsltKqLcIPD6B4rU11bfZKnM0";
    //check for Auth
    $transitions.onBefore({ to: (state) => {
        $log.debug('navigating to:', state.name);
        const token = $window.localStorage.getItem('token');
        if (state.name === 'login' || state.name === 'auth') {
            return false;
        } else if (!token) {
            $window.localStorage.setItem('redirect', state.name);
            $window.localStorage.setItem('params', state.params);
        }
        return true;
    } }, () => {
        if ($window.localStorage.getItem('token')) {
            return $q.resolve();
        }
        $state.go('login');
        return $q.reject();
    });
    $transitions.onStart({ to: state => state.name !== 'login' && state.name !== 'auth' }, (trans) => {
        block.start();
        const users = trans.injector().get('users');
        return users.getCurrent(false, true).catch((error) => {
            if (error.redirect) {
                return trans.router.stateService.target(error.redirect);
            }
        });
    });
    $transitions.onFinish(null, () => {
        block.reset();
    });
    $transitions.onError(null, () => {
        block.reset();
    });
}
