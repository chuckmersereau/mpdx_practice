import * as bowser from 'bowser';
import { defaultTo } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import session, { SessionService } from '../common/session/session.service';
import uiRouter from '@uirouter/angularjs';

class RootController {
    constructor(
        private $window: ng.IWindowService,
        private $state: StateService,
        private session: SessionService
    ) {}
    $onInit() {
        if (
            (bowser.android || bowser.ios)
            && defaultTo(true, this.$window.localStorage.getItem('hide_mobile') !== 'true')
        ) {
            this.$window.localStorage.setItem('hide_mobile', 'true');
            this.$state.go('mobile');
        }
    }
}
const Root = {
    template: require('./root.html'),
    controller: RootController
};

export default angular.module('mpdx.root.component', [
    uiRouter,
    session
]).component('root', Root).name;
