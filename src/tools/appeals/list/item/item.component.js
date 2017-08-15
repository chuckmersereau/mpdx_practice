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

export default angular.module('mpdx.tools.appeals.list.item.component', [])
    .component('appealsListItem', AppealsListItem).name;
