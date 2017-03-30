class SuccessController {
    constructor(
        $scope, $state
    ) {
        this.$scope = $scope;
        this.$state = $state;
    }
    done() {
        this.$state.go('tools');
        this.$scope.$hide();
    }
}

export default angular.module('mpdx.tools.import.tnt.success.controller', [])
    .controller('tntSuccessController', SuccessController).name;