class InfoController {
    constructor(
        $scope,
        infoPromise, message, title
    ) {
        this.$scope = $scope;
        this.infoPromise = infoPromise;
        this.message = message;
        this.title = title;
    }
    ok() {
        this.infoPromise.resolve();
        this.$scope.$hide();
    }
}

export default angular.module('mpdx.common.modal.info.controller', [])
    .controller('infoController', InfoController).name;