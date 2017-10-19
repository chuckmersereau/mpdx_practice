import component from './list.component';
import editFields from './editFields/editFields.controller';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/index.module';
import map from './map/map.controller';
import merge from './merge/merge.controller';
import search from './search/search.component';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    exportContacts,
    item,
    map,
    merge,
    search
]).name;
