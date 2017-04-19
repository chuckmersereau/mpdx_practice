import eq from 'lodash/fp/eq';

class Session {
    api;
    fullsite;
    constructor(
        $state,
        api
    ) {
        this.$state = $state;
        this.api = api;

        this.alert = null;
        this.data = {};
        this.downloading = false;
        this.fullsite = true;
        this.fullScreen = false;
        this.notice = null;
    }
    isInState(match) {
        return this.$state.$current.name.indexOf(match) === 0;
    }
    isInExactState(match) {
        return eq(this.$state.$current.name, match);
    }
}

export default angular.module('mpdx.services.session', [])
    .service('session', Session).name;