import component from './people.component';
import item from './item/item.component';

export default angular.module('mpdx.tools.merge.people', [
    item,
    component
]).name;
