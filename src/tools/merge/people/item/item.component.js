const Item = {
    template: require('./item.html'),
    bindings: {
        person: '<',
        contact: '<',
        onClick: '&',
        ignore: '<'
    }
};

export default angular.module('mpdx.tools.merge.people.item.component', [])
    .component('mergePeopleItem', Item).name;
