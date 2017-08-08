class Session {
    constructor(
        $state
    ) {
        this.$state = $state;
        this.navSecondary = false;
        this.navImpersonation = false;
        this.showFiltersOnMobile = false;
    }

    isInState(match) {
        return this.$state.$current.name.indexOf(match) === 0;
    }
}

import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.services.session', [
    uiRouter
]).service('session', Session).name;
