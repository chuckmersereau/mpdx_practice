class ConfirmController {
    constructor(
        $scope,
        confirmPromise, message, title
    ) {
        this.$scope = $scope;
        this.confirmPromise = confirmPromise;
        this.message = message;
        this.title = title;
    }
    no() {
        this.confirmPromise.reject();
        this.$scope.$hide();
    }
    yes() {
        this.confirmPromise.resolve();
        this.$scope.$hide();
    }
}

export default angular.module('mpdx.common.modal.confirm.controller', [])
    .controller('confirmController', ConfirmController).name;