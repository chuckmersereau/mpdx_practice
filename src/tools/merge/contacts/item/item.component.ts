const Item: ng.IComponentOptions = {
    template: require('./item.html'),
    bindings: {
        contact: '<',
        onClick: '&',
        ignore: '<'
    }
};

export default angular.module('mpdx.tools.merge.contacts.item.component', [])
    .component('mergeContactsItem', Item).name;
