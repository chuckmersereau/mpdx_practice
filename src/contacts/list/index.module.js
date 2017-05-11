import component from './list.component';
import editFields from './editFields/editFields.controller';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/index.module';
import mapContacts from './mapContacts/mapContacts.controller';
import mergeContacts from './mergeContacts/mergeContacts.controller';
import search from './search/search.component';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    exportContacts,
    item,
    mapContacts,
    mergeContacts,
    search
]).name;
