class ImportTntSuccessController {
    constructor(
        $scope,
        $state
    ) {
        this.$scope = $scope;
        this.$state = $state;
    }
    setup() {
        this.$state.go('tools', { setup: true });
        this.$scope.$hide();
    }
    done() {
        this.$state.go('home');
        this.$scope.$hide();
    }
}

import uiRouter from 'angular-ui-router';

export default angular.module('mpdx.tools.import.tnt.success.controller', [
    uiRouter
]).controller('importTntSuccessController', ImportTntSuccessController).name;