import component from './sidebar.component';
import filter from './filter/index.module';
import list from './list/list.component';

export default angular.module('mpdx.contacts.sidebar', [
    component,
    filter,
    list
]).name;