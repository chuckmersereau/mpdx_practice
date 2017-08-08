import component from './item.component';
import stripMpdx from './stripMpdx.filter';

export default angular.module('mpdx.contacts.list.item', [
    component,
    stripMpdx
]).name;
