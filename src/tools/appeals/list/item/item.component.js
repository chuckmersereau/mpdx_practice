class ItemController {
    constructor(
        accounts, appeals
    ) {
        this.accounts = accounts;
        this.appeals = appeals;
    }
}

const AppealsListItem = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        appeal: '<',
        onPrimary: '&'
    }
};

import accounts from 'common/accounts/accounts.service';
import appeals from '../../appeals.service';

export default angular.module('mpdx.tools.appeals.list.item.component', [
    accounts, appeals
]).component('appealsListItem', AppealsListItem).name;
