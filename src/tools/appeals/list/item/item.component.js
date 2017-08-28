class ItemController {
    constructor(
        locale
    ) {
        this.locale = locale;
    }
}

const AppealsListItem = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        appeal: '<'
    }
};

import locale from 'common/locale/locale.service';

export default angular.module('mpdx.tools.appeals.list.item.component', [
    locale
]).component('appealsListItem', AppealsListItem).name;
