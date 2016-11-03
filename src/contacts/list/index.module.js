import component from './list.component';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/item.component';

export default angular.module('mpdx.contacts.list', [
    component,
    exportContacts,
    item
]).name;