import component from './coaches.component';
import list from './list/list.component';
import listItem from './list/item/item.component';
import show from './show/show.component';

export default angular.module('mpdx.coaches', [
    component,
    list,
    listItem,
    show
]).name;
