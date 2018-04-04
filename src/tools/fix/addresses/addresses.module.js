import component from './addresses.component';
import field from './item/field/field.component';
import item from './item/item.component';

export default angular.module('mpdx.tools.fix.addresses', [
    component,
    field,
    item
]).name;
