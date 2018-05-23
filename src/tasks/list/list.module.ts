import add from './add/add.component';
import component from './list.component';
import drawer from './drawer/drawer.component';
import drawerContact from './drawer/contact/item.component';
import item from './item/item.component';
import itemComment from './drawer/comment/comment.component';

export default angular.module('mpdx.tasks.list', [
    component,
    drawer,
    drawerContact,
    item,
    itemComment,
    add
]).name;
