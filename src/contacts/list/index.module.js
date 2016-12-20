import component from './list.component';
import editFields from './editFields/editFields.controller';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/index.module';
import mergeContacts from './mergeContacts/mergeContacts.controller';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    exportContacts,
    item,
    mergeContacts
]).name;