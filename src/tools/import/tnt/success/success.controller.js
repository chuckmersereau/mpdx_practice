class SuccessController {
    constructor(
        $scope, $state
    ) {
        this.$scope = $scope;
        this.$state = $state;
    }
    setup() {
        this.$state.go('tools', {setup: true});
        this.$scope.$hide();
    }
    done() {
        this.$state.go('home');
        this.$scope.$hide();
    }
}

export default angular.module('mpdx.tools.import.tnt.success.controller', [])
    .controller('tntSuccessController', SuccessController).name;