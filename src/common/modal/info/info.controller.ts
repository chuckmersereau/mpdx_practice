class InfoController {
    constructor(
        private $scope: mgcrea.ngStrap.modal.IModalScope,
        private infoPromise: any,
        private message: string,
        private title: string
    ) {
        this.$scope = $scope;
        this.infoPromise = infoPromise;
        this.message = message;
        this.title = title;
    }
    ok() {
        this.infoPromise.resolve();
        this.$scope.$hide();
        return this.infoPromise.promise;
    }
}

export default angular.module('mpdx.common.modal.info.controller', [])
    .controller('infoController', InfoController).name;
