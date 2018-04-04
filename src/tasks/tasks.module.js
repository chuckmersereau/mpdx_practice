import component from './tasks.component';
import filter from './filter/filter.module';
import list from './list/list.module';
import modals from './modals/modals.module';
import search from './search/search.component';

export default angular.module('mpdx.tasks', [
    component,
    filter,
    list,
    modals,
    search
]).name;
