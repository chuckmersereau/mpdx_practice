import component from './list.component';
import item from './item/item.component';
import mergeContacts from './mergeContacts/mergeContacts.controller';
import pledgeFrequencyStr from './item/plegeFrequency/pledgeFrequencyStr';

export default angular.module('mpdx.contacts.list', [
    component,
    item,
    mergeContacts,
    pledgeFrequencyStr
]).name;