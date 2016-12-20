import component from './item.component';
import pledgeFrequencyStr from './plegeFrequency/pledgeFrequencyStr';
import stripMpdx from './stripMpdx.filter';


export default angular.module('mpdx.contacts.list.item', [
    component,
    pledgeFrequencyStr,
    stripMpdx
]).name;