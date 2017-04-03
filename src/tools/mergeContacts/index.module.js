import item from './item/item.component';
import component from './mergeContacts.component';
import service from './mergeContacts.service';

export default angular.module('mpdx.tools.mergeContacts', [
    item,
    component,
    service
]).name;
