import component from './list.component';
import exportContacts from './exportContacts/exportContacts.controller';
import item from './item/item.component';
import pledgeFrequencyStr from './item/plegeFrequency/pledgeFrequencyStr';

export default angular.module('mpdx.contacts.list', [
    component,
    exportContacts,
    item,
    pledgeFrequencyStr
]).name;