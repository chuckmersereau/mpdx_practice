import component from './phone.component';
import field from './item/field/field.component';
import item from './item/item.component';

export default angular.module('mpdx.tools.fix.phoneNumbers', [
    component,
    field,
    item
]).name;
