import item from './item/item.component';
import component from './people.component';
import service from './people.service';

export default angular.module('mpdx.tools.merge.people', [
    item,
    component,
    service
]).name;