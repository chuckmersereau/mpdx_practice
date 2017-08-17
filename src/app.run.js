/*@ngInject*/
export default function appRun(
    $document, $q, $log, $rootScope, $state, $transitions, $window, authManager, blockUI
) {
    let initialPage = true;
    const block = blockUI.instances.get('root');
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();
    $transitions.onStart({ to: state => state.name !== 'login' && state.name !== 'auth' && state.name !== 'acceptInvite' }, trans => {
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
            .catch(error => {
                if (error.redirect) {
                    return trans.router.stateService.target(error.redirect);
                }
            });
    });
    $transitions.onStart({ to: 'admin' }, trans => {
        if (!authManager.isAuthenticated()) {
            return;
        }
        block.start();
        const users = trans.injector().get('users');
        return users.getCurrent(false, true)
            .then(currentUser => {
                if (currentUser.preferences.admin) {
                    return true;
                }
                return trans.router.stateService.target('unavailable');
            })
            .catch(() => {
                return trans.router.stateService.target('unavailable');
            });
    });
    $transitions.onFinish(null, (trans) => {
        changePageTitle(trans, $rootScope, $window);
        initialPage && fireAdobeAnalyticsDirectRuleCall($window);
        initialPage = false;
        block.reset();
    });
    $transitions.onError(null, () => {
        block.reset();
    });
    $rootScope.$on('$locationChangeSuccess', () => {
        !initialPage && fireAdobeAnalyticsDirectRuleCall($window);
        $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
    });
}

function fireAdobeAnalyticsDirectRuleCall($window) {
    $window._satellite && $window._satellite.track('page view');
}

function changePageTitle(transition, $rootScope, $window) {
    const newState = transition.$to();
    $rootScope.pageTitle = newState.title;
    $window.digitalData.page.pageInfo.pageName = newState.name.replace('.', ' : ');
}
