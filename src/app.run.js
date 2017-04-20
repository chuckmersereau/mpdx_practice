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
