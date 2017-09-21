class ItemController {
    constructor(
        people
    ) {
        this.people = people;
    }
}
const Item = {
    template: require('./item.html'),
    controller: ItemController,
    bindings: {
        person: '<',
        contact: '<',
        onClick: '&',
        ignore: '<'
    }
};

import people from 'contacts/show/people/people.service';

export default angular.module('mpdx.tools.merge.people.item.component', [
    people
]).component('mergePeopleItem', Item).name;
