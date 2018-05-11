import accounts, { AccountsService } from '../../../../common/accounts/accounts.service';
import appeals, { AppealsService } from '../../appeals.service';

class ItemController {
    constructor(
        private accounts: AccountsService,
        private appeals: AppealsService
    ) {}
}

const AppealsListItem = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        appeal: '<',
        onPrimary: '&'
    }
};

export default angular.module('mpdx.tools.appeals.list.item.component', [
    accounts, appeals
]).component('appealsListItem', AppealsListItem).name;
