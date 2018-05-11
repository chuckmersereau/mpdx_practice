import { get } from 'lodash/fp';
import { StateService, TransitionService } from '@uirouter/core';
import replaceAll from './common/fp/replaceAll';

function fireAdobeAnalyticsDirectRuleCall($window) {
    $window._satellite && $window._satellite.track('page view');
}

function changePageTitle(transition, $rootScope, $window) {
    const newState = transition.$to();
    $rootScope.pageTitle = newState.title;
    const name = newState.name.toLowerCase();
    const arr = name.split('.');
    $window.digitalData.page.category.primaryCategory = get('[0]', arr);
    $window.digitalData.page.category.subCategory1 = get('[1]', arr);
    $window.digitalData.page.category.subCategory2 = get('[2]', arr);
    $window.digitalData.page.category.subCategory3 = get('[3]', arr);
    $window.digitalData.page.pageInfo.pageName = replaceAll('.', ' : ', name);
}

/* @ngInject*/
export default function appRun(
    $document: ng.IDocumentService,
    $q: ng.IQService,
    $log: ng.ILogService,
    $rootScope: ng.IRootScopeService,
    $state: StateService,
    $transitions: TransitionService,
    $window: ng.IWindowService,
    authManager,
    blockUI: IBlockUIService
) {
    let initialPage = true;
    const block = blockUI.instances.get('root');
    authManager.checkAuthOnRefresh();
    authManager.redirectWhenUnauthenticated();
    $transitions.onStart({
        to: (state) => state.name !== 'login' && state.name !== 'auth' && state.name !== 'acceptInvite'
    }, (trans) => {
        if (!authManager.isAuthenticated()) {
            return trans.router.stateService.target('login');
        }
        block.start();
        const users = trans.injector().get('users');
        return users.getCurrent(false, true).then((currentUser) => {
            $window.digitalData.user[0].profile[0].profileInfo.ssoGuid = currentUser.key_uuid;
            $window.digitalData.page.pageInfo.language = currentUser.preferences.locale;
        }).catch((error) => {
            if (error.redirect) {
                return trans.router.stateService.target(error.redirect);
            }
        });
    });
    $transitions.onStart({ to: 'admin' }, (trans) => {
        if (!authManager.isAuthenticated()) {
            return;
        }
        block.start();
        const users = trans.injector().get('users');
        return users.getCurrent(false, true).then((currentUser) => {
            if (currentUser.preferences.admin) {
                return true;
            }
            return trans.router.stateService.target('unavailable');
        }).catch(() => {
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
    const uncalledWatch = $rootScope.$on('$locationChangeSuccess', () => {
        !initialPage && fireAdobeAnalyticsDirectRuleCall($window);
        $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
    });
}
