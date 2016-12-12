class Rollout {
    active() {
        return true; // MOCK
    }
}

export default angular.module('mpdx.common.rollout.service', [])
    .service('rollout', Rollout).name;