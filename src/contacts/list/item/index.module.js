import component from './item.component';
import pledgeFrequencyToStr from './pledgeFrequencyToStr.filter';
import stripMpdx from './stripMpdx.filter';

export default angular.module('mpdx.contacts.list.item', [
    component,
    pledgeFrequencyToStr,
    stripMpdx
]).name;
