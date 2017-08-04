const Item = {
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
