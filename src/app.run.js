/*@ngInject*/
export default function appRun(
    $q, $log, $rootScope, $state, $transitions, $window, authManager, blockUI
) {
    const block = blockUI.instances.get('root');
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();

    $transitions.onStart({ to: state => state.name !== 'login' && state.name !== 'auth' }, (trans) => {
        if (!authManager.isAuthenticated()) {
            return;
        }
        block.start();
        const users = trans.injector().get('users');
        return users.getCurrent(false, true)
            .then(currentUser => {
                $window.digitalData.user[0].profile[0].profileInfo.ssoGuid = currentUser.key_uuid;
                $window.digitalData.page.pageInfo.language = currentUser.preferences.locale;
            })
            .catch((error) => {
                if (error.redirect) {
                    return trans.router.stateService.target(error.redirect);
                }
            });
    });
    $transitions.onFinish(null, (trans) => {
        changePageTitle(trans, $rootScope, $window);
        $window._satellite && $window._satellite.track('page view');
        block.reset();
    });
    $transitions.onError(null, () => {
        block.reset();
    });
}

function changePageTitle(transition, $rootScope, $window) {
    const newState = transition.$to();
    $rootScope.pageTitle = newState.title;
    $window.digitalData.page.pageInfo.pageName = newState.name.replace('.', ' : ');
}