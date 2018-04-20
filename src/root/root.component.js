import bowser from 'bowser';
import { defaultTo } from 'lodash/fp';

class RootController {
    constructor(
        $window, $state,
        session
    ) {
        this.$window = $window;
        this.$state = $state;
        this.session = session;
    }
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

import uiRouter from '@uirouter/angularjs';
import session from 'common/session/session.service';

export default angular.module('mpdx.root.component', [
    uiRouter,
    session
]).component('root', Root).name;
