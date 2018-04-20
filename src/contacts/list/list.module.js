import component from './list.component';
import editFields from './editFields/editFields.controller';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/item.component';
import map from './map/map.controller';
import merge from './merge/merge.controller';
import search from './search/search.component';
import stripMpdxFilter from './item/stripMpdx.filter';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    exportContacts,
    item,
    map,
    merge,
    search,
    stripMpdxFilter
]).name;
