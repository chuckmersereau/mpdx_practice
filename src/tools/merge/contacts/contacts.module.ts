import component from './contacts.component';
import item from './item/item.component';

export default angular.module('mpdx.tools.merge.contacts', [
    item,
    component
]).name;