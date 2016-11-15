import component from './list.component';
import editFields from './editFields/editFields.controller';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/item.component';
import mergeContacts from './mergeContacts/mergeContacts.controller';
import pledgeFrequencyStr from './item/plegeFrequency/pledgeFrequencyStr';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    exportContacts,
    item,
    mergeContacts,
    pledgeFrequencyStr
]).name;