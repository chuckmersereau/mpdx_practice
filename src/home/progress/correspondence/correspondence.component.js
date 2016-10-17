class CorrespondenceController {
}

var progressCorrespondence = {
    template: require('./correspondence.html'),
    controller: CorrespondenceController,
    bindings: {
        correspondence: '<'
    }
};

export default angular.module('mpdx.home.progress.correspondence', [])
    .component('progressCorrespondence', progressCorrespondence).name;
