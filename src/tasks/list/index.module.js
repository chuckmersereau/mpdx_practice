import component from './list.component';
import item from './item/index.module';
import add from './add/add.component';

export default angular.module('mpdx.tasks.list', [
    component,
    item,
    add
]).name;
