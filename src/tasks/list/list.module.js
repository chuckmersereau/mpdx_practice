import component from './list.component';
import drawer from './drawer/drawer.component';
import item from './item/item.component';
import itemComment from './drawer/comment/comment.component';
import add from './add/add.component';

export default angular.module('mpdx.tasks.list', [
    component,
    drawer,
    item,
    itemComment,
    add
]).name;
