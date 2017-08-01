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
        person: '<',
        contact: '<',
        onClick: '&',
        selected: '<',
        ignored: '<'
    }
};

export default angular.module('mpdx.tools.merge.people.item.component', [])
    .component('mergePeopleItem', Item).name;
