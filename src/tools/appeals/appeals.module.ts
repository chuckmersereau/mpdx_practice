import component from './appeals.component';
import list from './list/list.component';
import listItem from './list/item/item.component';
import show from './show/show.module';
import wizard from './wizard/wizard.component';

export default angular.module('mpdx.tools.appeals', [
    component,
    list,
    listItem,
    show,
    wizard
]).name;