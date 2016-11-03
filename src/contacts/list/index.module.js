import component from './list.component';
import item from './item/item.component';
import mergeContacts from './mergeContacts/mergeContacts.controller';

export default angular.module('mpdx.contacts.list', [
    component,
    item,
    mergeContacts
]).name;