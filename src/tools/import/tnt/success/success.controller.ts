import { StateService } from '@uirouter/core';
import uiRouter from '@uirouter/angularjs';

class ImportTntSuccessController {
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private $state: StateService
    ) {}
    setup() {
        this.$state.go('tools', { setup: true });
        this.$scope.$hide();
    }
    done() {
        this.$state.go('home');
        this.$scope.$hide();
    }
}

export default angular.module('mpdx.tools.import.tnt.success.controller', [
    uiRouter
]).controller('importTntSuccessController', ImportTntSuccessController).name;