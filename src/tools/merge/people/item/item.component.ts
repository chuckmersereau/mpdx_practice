import people, { PeopleService } from '../../../../contacts/show/people/people.service';

class ItemController {
    constructor(
        private people: PeopleService
    ) {}
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

export default angular.module('mpdx.tools.merge.people.item.component', [
    people
]).component('mergePeopleItem', Item).name;
