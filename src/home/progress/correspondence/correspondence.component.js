class CorrespondenceController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

let progressCorrespondence = {
    template: require('./correspondence.html'),
    controller: CorrespondenceController
};

export default angular.module('mpdx.home.progress.correspondence', [])
    .component('progressCorrespondence', progressCorrespondence).name;
