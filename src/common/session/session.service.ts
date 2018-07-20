import { StateService } from '@uirouter/core';
import uiRouter from '@uirouter/angularjs';

export class SessionService {
    navImpersonation: boolean;
    navSecondary: boolean;
    navSetup: boolean;
    showFilters: boolean;
    constructor(
        private $state: StateService
    ) {
        this.navSecondary = false;
        this.navSetup = false;
        this.navImpersonation = false;
        this.showFilters = true;
    }
    isInState(match: string): boolean {
        return this.$state.$current.name.indexOf(match) === 0;
    }
}

export default angular.module('mpdx.services.session', [
    uiRouter
]).service('session', SessionService).name;
