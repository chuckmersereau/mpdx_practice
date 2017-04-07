class ConfirmController {
    constructor(
        $scope,
        confirmPromise, summary, message, title
    ) {
        this.$scope = $scope;
        this.confirmPromise = confirmPromise;
        this.summary = summary;
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

export default angular.module('mpdx.tools.fixMailingAddress.item.address.modal.confirm.controller', [])
    .controller('addressConfirmController', ConfirmController).name;