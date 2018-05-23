import component from './email.component';
import field from './item/field/field.component';
import item from './item/item.component';

export default angular.module('mpdx.tools.fix.emailAddresses', [
    component,
    field,
    item
]).name;
