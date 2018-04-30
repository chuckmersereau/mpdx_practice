const Item = {
    template: require('./item.html'),
    bindings: {
        account: '<'
    }
};

export default angular.module('mpdx.coaches.list.item.component', [
]).component('coachesListItem', Item).name;
