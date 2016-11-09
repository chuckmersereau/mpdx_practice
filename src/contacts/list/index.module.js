import component from './list.component';
import editFields from './editFields/editFields.controller';
import item from './item/item.component';
import pledgeFrequencyStr from './item/plegeFrequency/pledgeFrequencyStr';

export default angular.module('mpdx.contacts.list', [
    component,
    editFields,
    item,
    pledgeFrequencyStr
]).name;