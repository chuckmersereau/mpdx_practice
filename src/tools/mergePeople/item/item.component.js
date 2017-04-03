class ItemController {
}

const Item = {
    controller: ItemController,
    template: require('./item.html'),
    bindings: {
        person: '<',
        onClick: '&',
        selected: '<',
        ignored: '<'
    }
};

export default angular.module('mpdx.tools.mergePeople.item.component', [])
    .component('mergePeopleItem', Item).name;
