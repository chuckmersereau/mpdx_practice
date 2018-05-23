class ConfirmController {
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private confirmPromise: any,
        private message: string,
        private title: string
    ) {}
    no() {
        this.confirmPromise.reject();
        this.$scope.$hide();
        return this.confirmPromise.promise;
    }
    yes() {
        this.confirmPromise.resolve();
        this.$scope.$hide();
        return this.confirmPromise.promise;
    }
}

export default angular.module('mpdx.common.modal.confirm.controller', [])
    .controller('confirmController', ConfirmController).name;
