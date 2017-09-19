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

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.correspondence', [
    accounts
]).component('progressCorrespondence', progressCorrespondence).name;
