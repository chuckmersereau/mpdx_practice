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
        person: '<',
        contact: '<',
        onClick: '&',
        selected: '<',
        ignored: '<'
    }
};

export default angular.module('mpdx.tools.mergePeople.item.component', [])
    .component('mergePeopleItem', Item).name;
