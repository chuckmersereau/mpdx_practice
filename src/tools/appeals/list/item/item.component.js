class ItemController {
    constructor(
        accounts, locale
    ) {
        this.accounts = accounts;
        this.locale = locale;
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
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.appeals.list.item.component', [
    accounts, locale
]).component('appealsListItem', AppealsListItem).name;
