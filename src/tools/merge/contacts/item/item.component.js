class ItemController {
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
        ignored: '<'
    }
};

export default angular.module('mpdx.tools.merge.contacts.item.component', [])
    .component('mergeContactsItem', Item).name;
