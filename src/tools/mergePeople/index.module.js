import item from './item/item.component';
import component from './mergePeople.component';
import service from './mergePeople.service';

export default angular.module('mpdx.tools.mergePeople', [
    item,
    component,
    service
]).name;
