import component from './list.component';
import item from './item/item.component';
import pledgeFrequencyStr from './item/plegeFrequency/pledgeFrequencyStr';

export default angular.module('mpdx.contacts.list', [
    component,
    pledgeFrequencyStr,
    item
]).name;