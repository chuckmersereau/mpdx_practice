import component from './contacts.component';
import filter from './filter/index.module';
import list from './list/index.module';
import show from './show/index.module';

export default angular.module('mpdx.contacts', [
    component,
    filter,
    list,
    show
]).name;