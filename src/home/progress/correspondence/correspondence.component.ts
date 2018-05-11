import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

class CorrespondenceController {
    constructor(
        private accounts: AccountsService
    ) {}
}

let progressCorrespondence = {
    template: require('./correspondence.html'),
    controller: CorrespondenceController
};

export default angular.module('mpdx.home.progress.correspondence', [
    accounts
]).component('progressCorrespondence', progressCorrespondence).name;
