class ItemController {
    locale;

    constructor(
        locale
    ) {
        this.locale = locale;
    }
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        contact: '<',
        onClick: '&',
        selected: '<',
        ignored: '<'
    }
};

export default angular.module('mpdx.tools.mergeContacts.item.component', [])
    .component('mergeContactsItem', Item).name;
