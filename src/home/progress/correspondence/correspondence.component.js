class CorrespondenceController {
    constructor() {

    }
}

var progressCorrespondence = {
    template: require('./correspondence.html'),
    controller: CorrespondenceController,
    bindings: {
        correspondence: '<'
    }
};
angular.module('mpdx.home.progress.correspondence', [])
    .component('progressCorrespondence', progressCorrespondence).name;
